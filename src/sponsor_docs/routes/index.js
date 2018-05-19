// get an instance of router
var router = require('express').Router();
var path    = require('path');
const store = require('../stores')
const userStore = require('../../users/stores')

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

/* ============================================== */
/**      G E T    S P O N S O R     D O C S       */
/* ============================================== */

/** GET route - listDocs */
router.get('/listDocs', (req,res) => {
    console.dir(req.session_state)
    if (req.session_state.username) {
        store.getDocs(req.session_state.spnId).then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/docList.pug'),
                        {
                        list:data
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getDoc/:DocId */
router.get('/getDoc/:DocId', (req,res) =>{
    if (req.session_state.username) {
        store.getDoc(req.params.DocId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


/* ============================================== */
/**      C R E A T E   S P O N S O R    D O C S   */
/* ============================================== */

/** GET route */
router.get('/createDoc', (req,res) => { 
    if (req.session_state.username) {
        console.dir(req.session_state)
        res.render(require.resolve('../views/createDoc.pug'),
        {
            SpnId: req.session_state.spnId
        }
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createDoc', (req, res) => {
    //console.log('POST method called')
    store
        .createDoc({
            DocTitle: req.body.DocTitle,
            DocDescr: req.body.DocDescr,
            SpnId: req.body.SpnId
            })
        .then(() => res.redirect('/sponsor_docs/listDocs'))
})

/* ============================================== */
/**      D E L E T E   S P O N S O R    D O C S   */
/* ============================================== */

/** Delete Doc */
router.get('/deleteDoc/:DocId', (req, res) => {
    if (req.session_state.username) {
        store.getDoc(req.params.DocId).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteDoc.pug'),
                            {
                            title:'Delete Document',
                            heading: 'Delete Document From Database',
                            DocId: data[0].DocId,
                            DocTitle: data[0].DocTitle,
                            DocDescr: data[0].DocDescr,
                            SpnId: data[0].SpnId
                            }) 
            }
            else {
                res.send('Error: Document does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

router.post('/deleteDoc', (req, res) => {
    store.deleteDoc({
        DocId: req.body.DocId
        })
    .then(() => res.redirect('/sponsor_docs/listDocs'))
})

/* ============================================ */
/**      E D I T    S P O N S O R    D O C S    */
/* ============================================ */

/** Edit Dcouments */
router.get('/editDoc/:DocId', (req,res) =>{
    if (req.session_state.username) {
        store.getDoc(req.params.DocId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editDoc.pug'),
                        {
                            DocId: data[0].DocId,
                            DocTitle: data[0].DocTitle,
                            DocDescr: data[0].DocDescr,
                            SpnId: data[0].SpnId
                        }) 
            }
            else {
                res.send('Error: Document does not exist')
            }
        }) 
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
router.post('/editDoc', (req, res) => {
    store.editDoc({
        DocId: req.body.DocId,
        DocTitle: req.body.DocTitle,
        DocDescr: req.body.DocDescr,
        SpnId: req.body.SpnId
        })
        .then((data) => {
            //console.dir(data)
            //let redirectFlag = Number(req.body.redirectFlag)
            //if (redirectFlag == 0) {
           res.redirect('/sponsor_docs/listDocs')
           //}
           //else if (redirectFlag == 1 ) {
           //    res.redirect('/home')
           //}
           //else {
           // res.send('Unauthorized')
           //}
        })
})
/* ============================================================= */
/**      E D I T    C U R R E N T    S P O N S O R    D O C S    */
/* ============================================================= */

/** Edit documents based on the current user logged in 
router.get('/editCurrentDoc', (req,res) =>{
    if (req.session_state.username) {
        userStore.getUser(req.session_state.username).then(users => {
            //console.dir(users[0])
            store.getFacilitator(users[0].PersonId).then(data => {
            if (data.length > 0) {
                res.render(require.resolve('../views/editDoc.pug'),
                        {
                            DocId: data[0].DocId,
                            DocTitle: data[0].DocTitle,
                            DocDescr: data[0].DocDescr,
                            SpnId: data[0].SpnId
                            //redirectFlag:1
                        }) 
            }
            else {
                res.send('Error: Document does not exist')
            }
            }) 
        })  
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
}) */
module.exports = router
