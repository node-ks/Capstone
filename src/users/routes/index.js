

// get an instance of router
var router = require('express').Router();

var path    = require('path');
const store = require('../stores')
const studentStore = require('../../students/stores')
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
    console.dir(req.body)
    store.authenticate({
        username: req.body.username,
        password: req.body.password
    })
      .then(({ success }) => {
        console.dir(success)  
        if (success) {
    // 2. Successful? Yes, set cookie
            req.session_state.username = req.body.username;
            res.redirect('/home');
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
    res.redirect('/home');
})
/* =========================== */
/**      W E L C O M E         */
/* =========================== */

/** GET route welcome */
router.get('/home', (req,res) => {

    if (req.session_state.username) {
            res.render(require.resolve('../views/home.pug'),
                        {
                            welcome: 'Welcome ' + req.session_state.username
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
                        studentId: data[0].StudentId,
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
            studentId: req.body.studentId,
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
    store.getUserById(userid).then((user) => {
        console.log('Role ID: ', roleid, 'Student ID: ', user.studentId)
        if (roleid === 0 && user.studentId == null) {
            console.log('Calling create student...')
            studentStore.createStudent({}).then(
                (studentIdArray)=>{
                    console.dir(studentIdArray)
                    console.log(`Log student from getUserById POST Route. Student id id: ${studentIdArray[0]}`)
                    store.editUserProfileId({
                        userid:userid,
                        studentId:studentIdArray[0]
                    }).then()
                }
            )
        }
    })
    
    
       res.redirect('/listUsers')
})

module.exports = router