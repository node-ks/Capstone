// get an instance of router
var router = require('express').Router();
var path    = require('path');
const store = require('../stores')
const userStore = require('../../users/stores')
const jobStore = require('../../jobs/stores')
const studentStore = require('../../students/stores')
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

/* ================================= */
/**      G E T   E M P L O Y E E S   */
/* ================================= */

router.get('/listEmployers', (req,res) => {

    if (req.session_state.username) {
        store.getEmployers().then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/employerList.pug'),
                        {
                        list:data
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

// GET route - getEmployer/:EmpId 
router.get('/getEmployer/:EmpId', (req,res) =>{
    if (req.session_state.username) {
        store.getEmployer(req.params.EmpId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})



/* ====================================================== */
/**      G E T   E M P L O Y E E S   B Y   J O B   I D    */
/* ====================================================== */

/** */

router.get('/listEmployee/:jobId', (req,res) => {

    if (req.session_state.username) {
        studentStore.studentByJob(req.params.jobId).then(employees => {
            employees.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/employeeList.pug'),
                        {
                        list:employees
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 


router.get('/getEmployer/:EmpId', (req,res) =>{
    if (req.session_state.username) {
        store.getEmployer(req.params.EmpId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})



/* ===================================================== */
/**      G E T   J O B S   B Y   E M P L O Y E R   I D   */
/* ===================================================== */

/** Gets Job by Employer ID */
router.get('/getJob', (req,res) =>{
    if (req.session_state.username) {
        console.log(req.session_state.PersonId)
        jobStore.getJobByEmployerId(req.session_state.PersonId).then(jobs => {
            jobs.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/jobList.pug'),
                        {
                        list:jobs
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

/* ================================================================ */
/**      G E T    J O B   D E T A I L S    B Y    J O B    ID       */
/* ================================================================ */

/** GET route - listJob */
router.get('/listJobDetails/:JobId', (req,res) => {
    //console.dir(req.session_state)
    if (req.session_state.username) {

        store.getJobDetailsByJobId(req.params.JobId).then(details => {
            //console.log('Job Details')
            console.dir(details)
            //console.log('req.session_state.studId: ' + req.session_state.studId)
            details.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/jobDetails.pug'),
                        {
                        list:details
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getJobDetails/:JobId */
router.get('/getJobDetails/:JobId', (req,res) =>{
    if (req.session_state.username) {
        store.getDocByStudentId(req.params.JobId).then(jobDetails => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* ====================================== */
/**      C R E A T E   E M P L O Y E R S   */
/* ====================================== */

/** GET route */
router.get('/createEmployer', (req,res) => { 
    if (req.session_state.username) {
        res.render(require.resolve('../views/createEmployer.pug'),
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createEmployer', (req, res) => {
    //console.log('POST method called')
    store
        .createEmployer({
            EmpName: req.body.EmpName,
            EmpAddress: req.body.EmpAddress,
            Phone: req.body.Phone,
            Email: req.body.Email,
            Rep: req.body.Rep
            })
        .then(() => res.redirect('/employer/listEmployers'))
})

/* ========================================= */
/**      D E L E T E   E M P L O Y E R S     */
/* ========================================= */

/** Delete Employer */
router.get('/deleteEmployer/:EmpId', (req, res) => {
    if (req.session_state.username) {
        store.getEmployer(req.params.EmpId).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteEmployer.pug'),
                            {
                            title:'Delete Employer',
                            heading: 'Delete Employer From Database',
                            EmpId: data[0].EmpId,
                            EmpName: data[0].EmpName,
                            Email: data[0].Email,
                            Rep: data[0].Rep
                            }) 
            }
            else {
                res.send('Employer does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

router.post('/deleteEmployer', (req, res) => {
store.deleteEmployer({
        EmpId: req.body.EmpId
    })
   .then(() => res.redirect('/employer/listEmployers'))
})

/* ======================================== */
/**      E D I T    E M P L O Y E R S       */
/* ======================================== */

/** Edit Employer */
router.get('/editEmployer/:EmpId', (req,res) =>{
    if (req.session_state.username) {
        store.getEmployer(req.params.EmpId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editEmployer.pug'),
                        {
                            EmpId: data[0].EmpId,
                            EmpName: data[0].EmpName,
                            EmpAddress: data[0].EmpAddress,
                            Phone: data[0].Phone,
                            Email: data[0].Email,
                            Rep: data[0].Rep
                        }) 
            }
            else {
                res.send('Employer does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editEmployer', (req, res) => {
    store.editEmployer({
        EmpId: req.body.EmpId,
        EmpName: req.body.EmpName,
        EmpAddress: req.body.EmpAddress,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Rep: req.body.Rep
        })
        .then((data) => {
            console.dir(data)
            let redirectFlag = Number(req.body.redirectFlag)
            if (redirectFlag == 0) {
           res.redirect('/employer/listEmployers')
           }
           else if (redirectFlag == 1 ) {
               res.redirect('/home')
           }
           else {
            res.send('Unauthorized')
           }
        })
})
/* ========================================================= */
/**      E D I T    C U R R E N T    E M P L O Y E R S       */
/* ========================================================= */

/** Edit Employer */
router.get('/editCurrentEmployer', (req,res) =>{
    if (req.session_state.username) {
        userStore.getUser(req.session_state.username).then(users => {
            console.dir(users[0])
            store.getEmployer(users[0].PersonId).then(data => {
            if (data.length > 0) {
                console.dir(data)
                res.render(require.resolve('../views/editEmployer.pug'),
                        {
                            EmpId: data[0].EmpId,
                            EmpName: data[0].EmpName,
                            EmpAddress: data[0].EmpAddress,
                            Phone: data[0].Phone,
                            Email: data[0].Email,
                            Rep: data[0].Rep,
                            redirectFlag:1
                        }) 
            }
            else {
                res.send('Employer does not exist')
            }
        }) 
    })
}
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})

/* ============================================================================= */
/**      V I E W    S U B M I T T E D   E M P L O Y E R   D O C   F I L E        */
/* ============================================================================= */

router.get('/viewJobFile/:FilePath',  (req, res) => {
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

/* ============================================================================= */
/**      V I E W    S U B M I T T E D   E M P L O Y E R   D O C   F I L E        */
/* ============================================================================= */

router.get('/viewEmployeeSubmissionFile/:FilePath',  (req, res) => {
    if (req.params.FilePath && req.session_state.username){
        console.log(path.resolve('../Experience Summer Work USA/src/students/routes/uploads/' + req.params.FilePath))
        fs.readFile(path.resolve('../Experience Summer Work USA/src/students/routes/uploads/' + req.params.FilePath), (err, data) => {  
            if (err) res.send('No files have been uploaded yet');
              else {
                res.sendFile(path.resolve('../Experience Summer Work USA/src/students/routes/uploads/' + req.params.FilePath));
              }
              console.log('req.params.FilePath: ' + req.params.FilePath);
            });
    }
});


module.exports = router
