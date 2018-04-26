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

/* ================================= */
/**      G E T   E M P L O Y E R S   */
/* ================================= */

/** GET route - listEmployers */
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

/** GET route - getEmployer/:EmpId */
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
           res.redirect('/employer/listEmployers')
        })
})
module.exports = router
