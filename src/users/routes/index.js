// get an instance of router
var router = require('express').Router();

var path    = require('path');
const store = require('../stores')
const studentStore = require('../../students/stores')
const sponsorStore = require('../../sponsors/stores')
const employerStore = require('../../employers/stores')
const facilitatorStore = require('../../facilitators/stores')
const roleStore = require('../../roles/stores')
/* ===================== */
/**      L O G I N       */
/* ===================== */

/** GET route */
router.get('/login', (req,res) => {
    res.render(require.resolve('../views/login.pug'))
}) 

/** POST route */
router.post('/login', (req, res) => {
    // 1. Authenticate
    store.authenticate({
        username: req.body.username,
        password: req.body.password
    })
      .then(({ success }) => {
        //console.dir(success)  
        if (success) {
    // 2. Successful? Yes, set cookie
            req.session_state.username = req.body.username;

            /** Get user role */
            if (req.session_state.username) {
                store.getUser(req.session_state.username).then(users => {
                    console.dir(users[0])
                    store.getRoleByUserId(users[0].UserId).then(UserRole => {
                        //console.log(UserRole)
                        req.session_state.roleId = UserRole[0].RoleId
                        //console.log(req.session_state.roleId)
                        if (req.session_state.roleId === 1){
                            sponsorStore.getSponsor(users[0].PersonId).then(Sponsor =>{
                                req.session_state.spnId = Sponsor[0].SpnId
                                //console.dir(req.session_state)
                                res.redirect('/home')
                            })
                        }
                        else if (req.session_state.roleId === 0){
                            studentStore.getStudent(users[0].PersonId).then(Student => {
                                //console.dir(Student)
                                req.session_state.spnId = Student[0].SponsorId
                                req.session_state.studId = Student[0].StudId
                                res.redirect('/home')
                            })
                        } 
                    else {   
                    res.redirect('/home')
                    }
                    })
                })
        
            }
            else {
            res.redirect('/home');
            }
        }
        else res.sendStatus(401)
      })
})

/* ===================== */
/**      L O G O U T     */
/* ===================== */

/** GET route */
router.get('/logout', (req,res)=>{
    req.session_state.reset();
    res.redirect('/login');
})
/* =========================== */
/**      W E L C O M E         */
/* =========================== */

/** GET route welcome */
router.get('/home', (req,res) => {

    if (req.session_state.username) {
        /**Sets edit profile option based on the type of user in the '/home' route for the 'PROFILE' button on the navbar  */
        let profileRole = req.session_state.roleId
        let studId = req.session_state.studId

        //console.log('Profile Role: ' + profileRole)
        //console.log(req.session_state.roleId)
        if (profileRole === 0) {
            profileView = '/student/editCurrentStudent'
        }
        else if (profileRole === 1) {
            profileView = '/sponsor/editCurrentSponsor'
        }
        else if (profileRole === 2) {
            profileView = '/employer/editCurrentEmployer'
        }
        else if (profileRole === 3) {
            profileView = '/facilitator/editCurrentFacilitator'
        }
        else {
            res.send('profileRole err: Role does not exist.')
        } 
    res.render(require.resolve('../views/home.pug'),
        {
            welcome: 'Hello ' + req.session_state.username + ',',
            profileRole:profileRole
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* =========================== */
/**      G E T   U S E R S     */
/* =========================== */

/** GET route - listUsers */
router.get('/listUsers', (req,res) => {

    if (req.session_state.username) {
        store.getUsers().then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/userList.pug'),
                        {
                        list:data,
                        editUser: 'Edit',
                        deleteUser: 'Delete'
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getStudent/:StudId */
router.get('/getStudent/:StudId', (req,res) =>{
    if (req.session_state.username) {
        store.getUser(req.params.StudId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


/* ================================= */
/**      C R E A T E   U S E R S     */
/* ================================= */

/** GET route */
router.get('/createUser', (req,res) => { 
    //if (req.session_state.username) {
        res.render(require.resolve('../views/createUser.pug'),
        { 
            title: 'Create User',
            heading: 'Create A New User' 
        })   
    }
    //else {
    //    res.render(require.resolve('../views/loginError.pug'))
    //}
//}
)

/* POST route */
router.post('/createUser', (req, res) => {
    console.log('POST method called')
    console.log(req.body.RoleRequested)
    store
        .createUser({
            username: req.body.username,
            password: req.body.password,
            Email: req.body.Email,
            RoleRequested: req.body.RoleRequested
        })
        .then(() => res.redirect('/login'))
})

/* ================================= */
/**      D E L E T E   U S E R S     */
/* ================================= */

/** Delete User */
router.get('/deleteUser/:username', (req, res) => {
    if (req.session_state.username) {
        store.getUser(req.params.username).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteUser.pug'),
                            {
                            title:'Delete User',
                            heading: 'Delete Student From Database',
                            username: data[0].UserName,
                            }) 
            }
            else {
                res.send('Student does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

router.post('/deleteUser', (req, res) => {
store.deleteUser({
        username: req.body.username
    })
   .then(() => res.redirect('/listUsers'))
})

/* ================================= */
/**      E D I T    U S E R S        */
/* ================================= */

/** Edit User */
router.get('/editUser/:username', (req,res) =>{
    if (req.session_state.username) {
        store.getUser(req.params.username).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editUser.pug'),
                        {
                        title:'Edit User',
                        username: data[0].UserName,
                        personId: data[0].PersonId,
                        active: data[0].Active,
                        rolerequested: data[0].RoleRequested
                        }) 
            }
            else {
                res.send('Student does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editUser', (req, res) => {
    store.editUser({
            username: req.body.username,
            personId: req.body.personId,
            active: req.body.active,
            rolerequested: req.body.RoleRequested
        })
       .then(() => res.redirect('/listUsers'))
})


/* =========================================== */
/**      E D I T    U S E R    R O L E         */
/* =========================================== */

/** Edit User Role (Facilitator function to change the role of a user ) */
router.get('/editUserRole/:username', (req,res) =>{
    if (req.session_state.username) {
        store.getUser(req.params.username).then(data => {
            console.dir(data)
            var userIdInt = Number(data[0].UserId)
            console.log(userIdInt)
            if (data.length > 0) {
                 console.dir(data[0])
                res.render(require.resolve('../views/editUserRole.pug'),
                        {
                        title:'Edit User Role',
                        username: data[0].UserName,
                        userid: data[0].UserId
                        })  
            }
            else {
                res.send('Student does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editUserRole', (req, res) => {
    let roleid = Number(req.body.roleid)
    let userid = Number(req.body.userid)
    console.log(`Edit User Role with role ID: ${roleid} and user id: ${userid} ` )
    store.editUserRole({
            roleid,
            userid
        })
    
    //Check if student exists, if not create an empty student row in STUDENT table.
    store.getUserById(userid).then((user) => {
        console.log('Role ID: ', roleid, 'Student ID: ', user.personId)

        if (roleid === 0 && user.personId == null) {
            console.log('Calling create student...')
            studentStore.createStudent({}).then(
                (personIdArray)=>{
                    console.dir(personIdArray)
                    console.log(`Log student from getUserById POST Route. Student id: ${personIdArray[0]}`)
                    store.editUserProfileId({
                        userid:userid,
                        personId:personIdArray[0]
                    }).then()
                }
            )
        }
        //Check if sponsor exists, if not create an empty student row in SPONSOR table.
        else if (roleid === 1 && user.personId == null) {
            console.log('Calling create sponsor...')
            sponsorStore.createSponsor({}).then(
                (personIdArray)=>{
                    console.dir(personIdArray)
                    console.log(`Log sponsor from getUserById POST Route. Sponsor id: ${personIdArray[0]}`)
                    store.editUserProfileId({
                        userid:userid,
                        personId:personIdArray[0]
                    }).then()
                }
            )
        }
        //Check if employer exists, if not create an empty employer row in EMPLOYER table.
        else if (roleid === 2 && user.personId == null) {
            console.log('Calling create employer...')
            employerStore.createEmployer({}).then(
                (personIdArray)=>{
                    console.dir(personIdArray)
                    console.log(`Log employer from getUserById POST Route. Sponsor id: ${personIdArray[0]}`)
                    store.editUserProfileId({
                        userid:userid,
                        personId:personIdArray[0]
                    }).then()
                }
            )
        }
        //Check if facilitator exists, if not create an empty facilitator row in EMPLOYER table.
        else if (roleid === 3 && user.personId == null) {
            console.log('Calling create facilitator...')
            facilitatorStore.createFacilitator({}).then(
                (personIdArray)=>{
                    console.dir(personIdArray)
                    console.log(`Log sponsor from getUserById POST Route. Sponsor id: ${personIdArray[0]}`)
                    store.editUserProfileId({
                        userid:userid,
                        personId:personIdArray[0]
                    }).then()
                }
            )
        }
        else {
            res.send("Role doesn't exist!")
        }
       res.redirect('/listUsers')
        })
    }
)
module.exports = router