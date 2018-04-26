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

/* =========================== */
/**      G E T   J O B S       */
/* =========================== */

/** GET route - listJobs */
router.get('/listJobs', (req,res) => {

    if (req.session_state.username) {
        store.getJobs().then(data => {
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

/** GET route - getJob/:JobId */
router.get('/getJob/:JobId', (req,res) =>{
    if (req.session_state.username) {
        store.getJob(req.params.JobId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


/* ============================= */
/**      C R E A T E   J O B S   */
/* ============================= */

/** GET route */
router.get('/createJob', (req,res) => { 
    if (req.session_state.username) {
        res.render(require.resolve('../views/createJob.pug'),
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createJob', (req, res) => {
    //console.log('POST method called')
    store
        .createJob({
            EmpId: req.body.EmpId,
            JobTitle: req.body.JobTitle,
            JobDescr: req.body.JobDescr,
            Location: req.body.JobLocation,
            PayRate: req.body.Phone
            })
        .then(() => res.redirect('/job/listJobs'))
})

/* ============================= */
/**      D E L E T E   J O B S   */
/* ============================= */

/** Delete Job */
router.get('/deleteJob/:JobId', (req, res) => {
    if (req.session_state.username) {
        store.getJob(req.params.JobId).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteJob.pug'),
                            {
                            title:'Delete Job',
                            heading: 'Delete Job From Database',
                            JobId: data[0].JobId,
                            EmpId: data[0].EmpId,
                            JobTitle: data[0].JobTitle,
                            JobDescr: data[0].JobDescr,
                            Location: data[0].JobLocation,
                            PayRate: data[0].PayRate
                            }) 
            }
            else {
                res.send('Job does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

router.post('/deleteJob', (req, res) => {
    store.deleteJob({
        JobId: req.body.JobId
        })
    .then(() => res.redirect('/job/listJobs'))
})

/* =========================== */
/**      E D I T    J O B S    */
/* =========================== */

/** Edit Job */
router.get('/editJob/:JobId', (req,res) =>{
    if (req.session_state.username) {
        store.getJob(req.params.JobId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editJob.pug'),
                        {
                            JobId: data[0].JobId,
                            EmpId: data[0].EmpId,
                            JobTitle: data[0].JobTitle,
                            JobDescr: data[0].JobDescr,
                            Location: data[0].JobLocation,
                            PayRate: data[0].PayRate
                        }) 
            }
            else {
                res.send('Job does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editJob', (req, res) => {
    store.editJob({
        JobId: req.body.JobId,
        EmpId: req.body.EmpId,
        JobTitle: req.body.JobTitle,
        JobDescr: req.body.JobDescr,
        Location: req.body.JobLocation,
        PayRate: req.body.PayRate
        })
       .then((data) => {
           res.redirect('/job/listJobs')
        })
})
module.exports = router
