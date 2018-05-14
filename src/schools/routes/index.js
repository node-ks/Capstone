// get an instance of router
var router = require('express').Router();
var path    = require('path');
const store = require('../stores')

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

/* =============================== */
/**      G E T   S C H O O L S     */
/* =============================== */

/** GET route - listJobs */
router.get('/listSchools', (req,res) => {

    if (req.session_state.username) {
        store.getSchools().then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/schoolList.pug'),
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
router.get('/getSchool/:SchId', (req,res) =>{
    if (req.session_state.username) {
        store.getSchool(req.params.SchId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


/* ================================== */
/**      C R E A T E   S C H O O L    */
/* ================================== */

/** GET route */
router.get('/createSchool', (req,res) => { 
    if (req.session_state.username) {
        res.render(require.resolve('../views/createSchool.pug'),
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createSchool', (req, res) => {
    //console.log('POST method called')
    store
        .createFacilitator({
            SchId: req.body.SchId,
            SchName: req.body.SchName,
            SchAddress: req.body.SchAddress,
            Phone: req.body.Phone,
            Email: req.body.Email,
            Rep: req.body.Rep
            })
        .then(() => res.redirect('/school/listSchools'))
})

/* =================================== */
/**      D E L E T E   S C H O O L     */
/* =================================== */

/** Delete Facilitator */
router.get('/deleteSchool/:SchId', (req, res) => {
    if (req.session_state.username) {
        store.getSchool(req.params.SchId).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteSchool.pug'),
                            {
                            title:'Delete School',
                            heading: 'Delete School From Database',
                            SchId: data[0].SchId,
                            EmpId: data[0].EmpId,
                            SchName: data[0].SchName,
                            SchAddress: data[0].SchAddress,
                            Phone: data[0].Phone,
                            Email: data[0].Email,
                            Rep: data[0].Rep
                            }) 
            }
            else {
                res.send('School does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

router.post('/deleteSchool', (req, res) => {
store.deleteSchool({
        SchId: req.body.SchId
    })
   .then(() => res.redirect('/schools/listSchools'))
})

/* ================================= */
/**      E D I T    S C H O O L S    */
/* ================================= */

/** Edit School */
router.get('/editSchool/:SchId', (req,res) =>{
    if (req.session_state.username) {
        store.getSchool(req.params.SchId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editSchool.pug'),
                        {
                            SchId: data[0].SchId,
                            EmpId: data[0].EmpId,
                            SchName: data[0].SchName,
                            SchAddress: data[0].SchAddress,
                            Phone: data[0].Phone,
                            Email: data[0].Email,
                            Rep: data[0].Rep
                        }) 
            }
            else {
                res.send('School does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editSchool', (req, res) => {
    store.editSchool({
        SchId: req.body.SchId,
        EmpId: req.body.EmpId,
        SchName: req.body.SchName,
        SchAddress: req.body.SchAddress,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Rep: req.body.Rep
        })
       .then((data) => {
           res.redirect('/school/listSchools')
        })
})
module.exports = router
