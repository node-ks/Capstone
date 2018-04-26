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
/**      G E T   S P O N S O R S     */
/* ================================= */

/** GET route - listUsers */
router.get('/listSponsors', (req,res) => {

    if (req.session_state.username) {
        store.getSponsors().then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/sponsorList.pug'),
                        {
                        list:data
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getSponsor/:SpnId */
router.get('/getSponsor/:SpnId', (req,res) =>{
    if (req.session_state.username) {
        store.getSponsor(req.params.SpnId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


/* ===================================== */
/**      C R E A T E   S P O N S O R S   */
/* ===================================== */

/** GET route */
router.get('/createSponsor', (req,res) => { 
    if (req.session_state.username) {
        res.render(require.resolve('../views/createSponsor.pug'),
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createSponsor', (req, res) => {
    //console.log('POST method called')
    store
        .createSponsor({
            SpnName: req.body.SpnName,
            SpnAddress: req.body.SpnAddress,
            Phone: req.body.Phone,
            Email: req.body.Email
            })
        .then(() => res.redirect('/sponsor/listSponsors'))
})

/* ======================================= */
/**      D E L E T E   S P O N S O R S     */
/* ======================================= */

/** Delete User */
router.get('/deleteSponsor/:SpnId', (req, res) => {
    if (req.session_state.username) {
        store.getSponsor(req.params.SpnId).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteSponsor.pug'),
                            {
                            title:'Delete Sponsor',
                            heading: 'Delete Sponsor From Database',
                            SpnId: data[0].SpnId,
                            SpnName: data[0].SpnName,
                            Email: data[0].Email
                            }) 
            }
            else {
                res.send('Sponsor does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

router.post('/deleteSponsor', (req, res) => {
store.deleteSponsor({
        SpnId: req.body.SpnId
    })
   .then(() => res.redirect('/sponsor/listSponsors'))
})

/* ====================================== */
/**      E D I T    S P O N S O R S       */
/* ====================================== */

/** Edit User */
router.get('/editSponsor/:SpnId', (req,res) =>{
    if (req.session_state.username) {
        store.getSponsor(req.params.SpnId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editSponsor.pug'),
                        {
                            SpnId: data[0].SpnId,
                            SpnName: data[0].SpnName,
                            SpnAddress: data[0].SpnAddress,
                            Phone: data[0].Phone,
                            Email: data[0].Email
                        }) 
            }
            else {
                res.send('Sponsor does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editSponsor', (req, res) => {
    store.editSponsor({
        SpnId: req.body.SpnId,
        SpnName: req.body.SpnName,
        SpnAddress: req.body.SpnAddress,
        Phone: req.body.Phone,
        Email: req.body.Email,
        })
       .then((data) => {
           res.redirect('/sponsor/listSponsors')
        })
})
module.exports = router
