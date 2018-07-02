// get an instance of router
var router = require('express').Router();
var path    = require('path');
const store = require('../stores')
var formidable = require('formidable')
var fs = require('fs');

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
        //Check if current role is employer, if yes set a flag and pass it to pug
        let employerFlag = false;
        let employerId = 0;
        if (req.session_state.roleId === 2){
                employerFlag = true;
                employerId = req.session_state.PersonId
        }
        res.render(require.resolve('../views/createJob.pug'),
            {
                EmployerFlag:employerFlag,
                EmpId:employerId
            }
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createJob', (req, res) => {
    
        var form = new formidable.IncomingForm();
        var fileName = '';
        form.parse(req,  function(err, fields, files) {
        //console.log('calling createStudentDoc with :', files.upload.name, fields.DocId)
            //console.dir(fileName) 

             store
            .createJob({
                EmpId: fields.EmpId,
                JobTitle: fields.JobTitle,
                JobDescr: fields.JobDescr,
                JobLocation: fields.JobLocation,
                PayRate: fields.PayRate,
                FilePath: files.upload.name
                })
            .then(() => {
                console.log('Callback from createJob.')
                res.redirect('/home')
            }).catch(ex => console.log("CreateJob failed. Error is ", ex.status )) 
        });
        
        form.on('fileBegin',  (name, file) => {
            file.path = (path.resolve(__dirname + '/uploads/' + file.name));

        if (file.name == null) res.send('No files have been selected for uploading');
        })
    
        form.on('file',  (name, file) => {
            console.log('Uploaded ' + file.name);
        //res.sendFile(path.resolve(__dirname + '../../views/docList.pug'));
        }) 
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
                            JobLocation: data[0].JobLocation,
                            PayRate: data[0].PayRate,
                            Status: data[0].Status
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
        let employerFlag = false;
        if (req.session_state.roleId === 2){
                employerFlag = true;
        }
        store.getJob(req.params.JobId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editJob.pug'),
                        {
                            JobId: data[0].JobId,
                            EmpId: data[0].EmpId,
                            JobTitle: data[0].JobTitle,
                            JobDescr: data[0].JobDescr,
                            JobLocation: data[0].JobLocation,
                            PayRate: data[0].PayRate,
                            Status: data[0].Status,
                            employerFlag:employerFlag
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
        JobLocation: req.body.JobLocation,
        PayRate: req.body.PayRate,
        Status: req.body.Status
        })
       .then((data) => {
           res.redirect('/employer/getJob')
        })
})


/* ================================================= */
/**      V I E W    J O B    D O C    F I L E        */
/* ================================================= */

router.get('/viewFile/:FilePath',  (req, res) => {
    if (req.params.FilePath && req.session_state.username){
        console.log(path.resolve('../Experience Summer Work USA/src/jobs/routes/uploads/' + req.params.FilePath))
        fs.readFile(path.resolve('../Experience Summer Work USA/src/jobs/routes/uploads/' + req.params.FilePath), (err, data) => {  
            if (err) res.send('No files have been uploaded yet');
              else {
                res.sendFile(path.resolve('../Experience Summer Work USA/src/jobs/routes/uploads/' + req.params.FilePath));
              }
              console.log('req.params.FilePath: ' + req.params.FilePath);
            });
    }
});

module.exports = router
