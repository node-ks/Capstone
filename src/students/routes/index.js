// get an instance of router
var router = require('express').Router();
var path    = require('path');
const store = require('../stores')
const userStore = require('../../users/stores')
const docStore = require('../../sponsor_docs/stores')
const studDocStore = require('../../student_docs/stores')
const sponStore = require('../../sponsors/stores')
const jobStore = require('../../jobs/stores')
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

/* ================================= */
/**      G E T   S T U D E N T S     */
/* ================================= */

/** GET route - listUsers */
router.get('/listStudents', (req,res) => {

    if (req.session_state.username) {
        store.getStudents().then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/studentList.pug'),
                        {
                        list:data,
                        editUser: 'Edit',
                        deleteUser: 'Delete',
                        var: 'Hi',
                        profileRole:req.session_state.roleId
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getUser/:username */
router.get('/getStudent/:username', (req,res) =>{
    if (req.session_state.username) {
        store.getUser(req.params.username).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})
/* =========================================================== */
/**      G E T   S T U D E N T S   B Y   S P O N S O R    I D  */
/* =========================================================== */

/** GET route - listUsers */
router.get('/listSponsorStudents', (req,res) => {


    if (req.session_state.username) {
        let sponsorId = req.session_state.spnId

        store.getStudentsBySponsorId(sponsorId).then(data => {
            data.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/studentList.pug'),
                        {
                        list:data,
                        editUser: 'Edit',
                        deleteUser: 'Delete',
                        var: 'Hi'
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getUser/:username */
router.get('/getStudent/:username', (req,res) =>{
    if (req.session_state.username) {
        store.getUser(req.params.username).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* ===================================== */
/**      C R E A T E   S T U D E N T S   */
/* ===================================== */

/** GET route */
router.get('/createStudent', (req,res) => { 
    if (req.session_state.username) {
        res.render(require.resolve('../views/createStudent.pug')
        )   
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* POST route */
router.post('/createStudent', (req, res) => {
    //console.log('POST method called')
    store
        .createStudent({
            Fname: req.body.Fname,
            Mname: req.body.Mname,
            Lname: req.body.Lname,
            Gender: req.body.Gender,
            StudAddress: req.body.StudAddress,
            Dob: req.body.Dob,
            Phone: req.body.Phone,
            Gpa: req.body.Gpa,
            Email: req.body.Email,
            SchoolId: req.body.SchoolId
            })
        .then(() => res.redirect('/student/listStudents'))
})

/* ======================================= */
/**      D E L E T E   S T U D E N T S     */
/* ======================================= */

/** Delete User */
router.get('/deleteStudent/:StudId', (req, res) => {
    if (req.session_state.username) {
        store.getStudent(req.params.StudId).then(data => {

            if (data.length > 0) {
                res.render(require.resolve('../views/deleteStudent.pug'),
                            {
                            title:'Delete Student',
                            heading: 'Delete Student From Database',
                            StudId: data[0].StudId,
                            Fname: data[0].Fname,
                            Lname: data[0].Lname,
                            Email: data[0].Email
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

router.post('/deleteStudent', (req, res) => {
console.log('Post Delete Student')
console.log(req.body.StudId)    
store.deleteStudent({
        StudId: req.body.StudId
    })
   .then(() => res.redirect('/student/listStudents'))
})

/* ====================================== */
/**      E D I T    S T U D E N T S       */
/* ====================================== */

/** Edit User */
router.get('/editStudent/:StudId', (req,res) =>{
    if (req.session_state.username) {
        store.getStudent(req.params.StudId).then(data => {
            if (data.length > 0) {
                //console.log('Role ID: ')
                //console.log(data[0].JobId)
                sponStore.getSponsors().then(sponsors => {
                    jobStore.getJobs().then(jobs => {
                        res.render(require.resolve('../views/editStudent.pug'),
                            {
                                StudId: data[0].StudId,
                                Fname: data[0].Fname,
                                Mname: data[0].Mname,
                                Lname: data[0].Lname,
                                Gender: data[0].Gender,
                                StudAddress: data[0].StudAddress,
                                Dob: data[0].Dob.toLocaleDateString(),
                                Phone: data[0].Phone,
                                Gpa: data[0].Gpa,
                                Email: data[0].Email,
                                SchoolId: data[0].SchoolId,
                                SponsorId: data[0].SponsorId,
                                JobId: data[0].JobId,
                                profileRole: req.session_state.roleId,
                                sponsors:sponsors,
                                jobs:jobs,
                                redirectFlag:0,
                            }) 
                    })
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
router.post('/editStudent', (req, res) => {
    console.log('fname', req.body.Fname)
    console.log('fname', req.body.Mname)
    console.log('student id', req.body.StudId)
    store.editStudent({
        StudId: req.body.StudId,
        Fname: req.body.Fname,
        Mname: req.body.Mname,
        Lname: req.body.Lname,
        Gender: req.body.Gender,
        StudAddress: req.body.StudAddress,
        Dob: req.body.Dob,
        Phone: req.body.Phone,
        Gpa: req.body.Gpa,
        Email: req.body.Email,
        SchoolId: req.body.SchoolId,
        SponsorId: req.body.SponsorId,
        JobId: req.body.JobId 
        })
       .then((data) => {
            console.dir(data)
            let redirectFlag = Number(req.body.redirectFlag)
            if (redirectFlag == 0) {
           res.redirect('/student/listStudents')
           }
           else if (redirectFlag == 1 ) {
               res.redirect('/home')
           }
           else {
            res.send('Unauthorized')
           }
        })
    })
/* ====================================================== */
/**      E D I T    C U R R E N T    S T U D E N T        */
/* ====================================================== */

/** Edit student info for student user based on UserId and PersonId */
router.get('/editCurrentStudent', (req,res) => {
    if (req.session_state.username) {
        userStore.getUser(req.session_state.username).then(users => {
            console.dir(users[0])
            store.getStudent(users[0].PersonId).then(data => {
                if (data.length > 0) {
                    sponStore.getSponsors().then(sponsors => {

                        res.render(require.resolve('../views/editStudent.pug'),
                            {
                                StudId: data[0].StudId,
                                Fname: data[0].Fname,
                                Mname: data[0].Mname,
                                Lname: data[0].Lname,
                                Gender: data[0].Gender,
                                StudAddress: data[0].StudAddress,
                                Dob: data[0].Dob.toLocaleDateString(),
                                Phone: data[0].Phone,
                                Gpa: data[0].Gpa,
                                Email: data[0].Email,
                                SchoolId: data[0].SchoolId,
                                SponsorId: data[0].SponsorId,
                                JobId: data[0].JobId,
                                profileRole: req.session_state.roleId,
                                sponsors:sponsors,
                                redirectFlag:1
                            }) 
                    })
                    console.dir(data)
                }
                else {
                    res.send('Student does not exist')
                }
            })
        })

    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
    
})
/* ================================================ */
/**      V I E W    S T U D E N T     D O C S       */
/* ================================================ */

/** GET route - listDocs */
router.get('/uploadDocs', (req,res) => {
    //console.dir(req.session_state)
    if (req.session_state.username) {
        //console.dir(req.session_state)
        docStore.getDocs(req.session_state.spnId).then(data => {

            //console.dir(data)
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
        docStore.getDoc(req.params.DocId).then(data => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* ========================================================== */
/**      G E T    D O C S    B Y    S T U D E N T    ID       */
/* ========================================================== */

/** TODO: DELETE??? */

/** GET route - listDocs */
router.get('/listStudentDocs/:studId', (req,res) => {
    //console.dir(req.session_state)
    if (req.session_state.username) {

        /** If current user is a student then session state should have the student ID */
        let studentId = req.session_state.studId
        console.log(studentId)
        /** If current user is NOT a student, then get user param to display */
        if (Number(req.params.studId) !== 0) {
            studentId = req.params.studId
        }
        //console.log('/students/routes/listStudentDocs req.session_state.studId: ' +  req.session_state.studId)
        store.getDocByStudentId(studentId).then(docs => {
            //console.log('Stud Docs')
            console.dir(docs)
            //console.log('req.session_state.studId: ' + req.session_state.studId)
            docs.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/docList.pug'),
                        {
                        list:docs,
                        profileRole:req.session_state.roleId
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getDoc/:DocId */
router.get('/getDoc/:StudId', (req,res) =>{
    if (req.session_state.username) {
        store.getDocByStudentId(req.params.StudId).then(StudDocs => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})

/* ======================================================== */
/**      G E T    J O B    B Y    S T U D E N T    ID       */
/* ======================================================== */

/** GET route - listJob */
router.get('/listStudentJobDocs/:studId', (req,res) => {
    //console.dir(req.session_state)
    if (req.session_state.username) {

        /** If current user is a student then session state should have the student ID */
        let studentId = req.session_state.studId
        console.log(studentId)
        /** If current user is NOT a student, then get user param to display */
        if (Number(req.params.studId) !== 0) {
            studentId = req.params.studId
        }
        //console.log('/students/routes/listStudentDocs req.session_state.studId: ' +  req.session_state.studId)
        store.getJobDocByStudentId(studentId).then(docs => {
            //console.log('Stud Docs')
            console.dir(docs)
            //console.log('req.session_state.studId: ' + req.session_state.studId)
            docs.map((val, index) => val.snum = index + 1)
            res.render(require.resolve('../views/jobDocList.pug'),
                        {
                        list:docs,
                        profileRole:req.session_state.roleId
                        }) 
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
}) 

/** GET route - getDoc/:DocId */
router.get('/getJobDoc/:StudId', (req,res) =>{
    if (req.session_state.username) {
        store.getDocByStudentId(req.params.StudId).then(StudDocs => {
            // TODO: What is supposed to be here??
        })
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


/* ==================================================================== */
/**      U P L O A D    S P O N S O R   R E Q U I R E D    D O C S      */
/* ==================================================================== */

router.get('/submitDoc/:DocId',  (req, res) => {
    if (req.session_state.username) {
    res.render(require.resolve('../views/uploadDoc.pug'),{
        DocId:req.params.DocId
    })
    //req.params.DocId
                    
    //res.sendFile(path.resolve(__dirname + '../../views/submitDoc.pug'));
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


router.post('/uploadFile',  (req, res) => {
    var form = new formidable.IncomingForm();
    
    //console.dir(req.fields)
    form.parse(req,  function(err, fields, files) {
        //console.log('calling createStudentDoc with :', files.upload.name, fields.DocId)
        //console.dir(files.upload.name) 

        studDocStore
        .createStudentDoc({
            DocId: fields.DocId,
            StudId: req.session_state.studId,
            SpnId: req.session_state.spnId,
            FilePath: files.upload.name
            })
        .then(() => {
            console.log('Callback from createStudentDoc.')
            res.redirect('/student/listStudentDocs/0')
        }).catch(ex => console.log("CreateStudentDoc failed. Error is ", ex.status ))
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

/* ====================================================================== */
/**      U P L O A D    E M P L O Y E R   R E Q U I R E D    D O C S      */
/* ====================================================================== */

router.get('/submitEmployeeDoc/:JobId',  (req, res) => {
    if (req.session_state.username) {
    res.render(require.resolve('../views/uploadEmployeeDoc.pug'),{
        JobId:req.params.JobId
    })
    //req.params.DocId
                    
    //res.sendFile(path.resolve(__dirname + '../../views/submitDoc.pug'));
    }
    else {
        res.render(require.resolve('../views/loginError.pug'))
    }
})


router.post('/uploadEmployeeFile',  (req, res) => {
    var form = new formidable.IncomingForm();
    
    //console.dir(req.fields)
    form.parse(req,  function(err, fields, files) {
        //console.log('calling createStudentDoc with :', files.upload.name, fields.DocId)
        //console.dir(files.upload.name) 

        jobStore
        .editJobFilePath({
            JobId: fields.JobId,
            JobFilePath: files.upload.name
            })
        .then(() => {
            console.log('Callback from editJobFilePath')
            res.redirect('/home')
        }).catch(
            ex => /*console.log("UploadEmployeeDoc failed. Error is ", ex.status ) */ 
                  console.dir(ex)
        )
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

/* =========================================================================== */
/**      V I E W    S U B M I T T E D   S P O N S O R   D O C   F I L E        */
/* =========================================================================== */

router.get('/viewFile/:FilePath',  (req, res) => {
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


/* ======================================================== */
/**      V I E W   E M P L O Y E R   D O C   F I L E        */
/* ======================================================== */

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
