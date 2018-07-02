// get an instance of router
var router = require('express').Router();
var path    = require('path');
const store = require('../stores')
const userStore = require('../../users/stores')
const jobStore = require('../../jobs/stores')

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

/* ======================================= */
/**      G E T   F A C I L I T A T O R S   */
/* ======================================= */

/** GET route - listFacilitators */
router.get('/listFacilitators', (req,res) => {

    if (req.session_state.username) {
        store.getFacilitators().then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/facilitatorList.pug'),
                        {
                        list:data
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getFacilitator/:FacId */
router.get('/getFacilitator/:FacId', (req,res) =>{
    if (req.session_state.username) {
        store.getEmployer(req.params.FacId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* ====================================================== */
/**      G E T   J O B    B Y    E M P L O Y E R    I D   */
/* ====================================================== */

/** Gets Job by Employer ID when */
router.get('/getEmployerJob/:EmpId', (req,res) =>{
    if (req.session_state.username) {
        jobStore.getJobByEmployerId(req.params.EmpId).then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/jobList.pug'),
                        {
                        list:data
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* ============================================ */
/**      C R E A T E   F A C I L I T A T O R S   */
/* ============================================ */

/** GET route */
router.get('/createFacilitator', (req,res) => { 
    if (req.session_state.username) {
        res.render(require.resolve('../views/createFacilitator.pug'),
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createFacilitator', (req, res) => {
    //console.log('POST method called')
    store
        .createFacilitator({
            Fname: req.body.Fname,
            Mname: req.body.Mname,
            Lname: req.body.Lname,
            Email: req.body.Email,
            Phone: req.body.Phone
            })
        .then(() => res.redirect('/facilitator/listFacilitators'))
})

/* ============================================= */
/**      D E L E T E   F A C I L I T A T O R S   */
/* ============================================= */

/** Delete Facilitator */
router.get('/deleteFacilitator/:FacId', (req, res) => {
    if (req.session_state.username) {
        store.getFacilitator(req.params.FacId).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteFacilitator.pug'),
                            {
                            title:'Delete Facilitator',
                            heading: 'Delete Facilitator From Database',
                            FacId: data[0].FacId,
                            Fname: data[0].Fname,
                            Lname: data[0].Lname,
                            Email: data[0].Email
                            }) 
            }
            else {
                res.send('Facilitator does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

router.post('/deleteFacilitator', (req, res) => {
store.deleteFacilitator({
        FacId: req.body.FacId
    })
   .then(() => res.redirect('/facilitator/listFacilitators'))
})

/* =========================================== */
/**      E D I T    F A C I L I T A T O R S    */
/* =========================================== */

/** Edit Facilitator */
router.get('/editFacilitator/:FacId', (req,res) =>{
    if (req.session_state.username) {
        store.getFacilitator(req.params.FacId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editFacilitator.pug'),
                        {
                            FacId: data[0].FacId,
                            Fname: data[0].Fname,
                            Mname: data[0].Mname,
                            Lname: data[0].Lname,
                            Email: data[0].Email,
                            Phone: data[0].Phone
                        }) 
            }
            else {
                res.send('Facilitator does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editFacilitator', (req, res) => {
    store.editFacilitator({
        FacId: req.body.FacId,
        Fname: req.body.Fname,
        Mname: req.body.Mname,
        Lname: req.body.Lname,
        Email: req.body.Email,
        Phone: req.body.Phone
        })
        .then((data) => {
            console.dir(data)
            let redirectFlag = Number(req.body.redirectFlag)
            if (redirectFlag == 0) {
           res.redirect('/facilitator/listFacilitators')
           }
           else if (redirectFlag == 1 ) {
               res.redirect('/home')
           }
           else {
            res.send('Unauthorized')
           }
        })
})
/* ============================================================= */
/**      E D I T     C U R R E N T    F A C I L I T A T O R S    */
/* ============================================================= */

/** Edit Facilitator */
router.get('/editCurrentFacilitator', (req,res) =>{
    if (req.session_state.username) {
        userStore.getUser(req.session_state.username).then(users => {
            //console.dir(users[0])
            store.getFacilitator(users[0].PersonId).then(data => {
            if (data.length > 0) {
                //console.dir(data)
                res.render(require.resolve('../views/editFacilitator.pug'),
                        {
                            FacId: data[0].FacId,
                            Fname: data[0].Fname,
                            Mname: data[0].Mname,
                            Lname: data[0].Lname,
                            Email: data[0].Email,
                            Phone: data[0].Phone,
                            redirectFlag:1
                        }) 
            }
            else {
                res.send('Facilitator does not exist')
                }
            })
        })    
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
module.exports = router
