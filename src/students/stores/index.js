const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createStudent:createStudent,
        getStudents: getStudents,
        getStudent:getStudent,
        getStudentsBySponsorId:getStudentsBySponsorId,
        getDocByStudentId:getDocByStudentId,
        getJobByStudentId:getJobByStudentId,
        getJobDocByStudentId:getJobDocByStudentId,
        editStudent:editStudent,
        deleteStudent:deleteStudent,
        studentsForEmployer:studentsForEmployer,
        studentByJob:studentByJob
    }

  function createStudent ({Fname, Mname, Lname, Gender, StudAddress, Dob, Phone, Gpa, Email, SchoolId }) {
    if (Dob === undefined){
      Dob = new Date()
    }
    console.log(`Add student ${Fname, Lname, Dob}`)
    return knex('STUDENT').insert({
        Fname:Fname,
        Mname:Mname,
        Lname:Lname,
        Gender:Gender,
        StudAddress:StudAddress,
        Dob:Dob,
        Phone:Phone,
        Gpa:Gpa,
        Email:Email,
        SchoolId:SchoolId,
    })
  }

/** GET ALL STUDENTS */
  function getStudents () {
    return knex.table('STUDENT')
    .then(function(data) {
      var result = data //JSON.stringify(data);
      return result;
    });
  }

/** GET ALL STUDENTS BY SPONSOR ID */
function getStudentsBySponsorId (sponsorId) {
  return knex.from('STUDENT')
  .where({SponsorId:sponsorId})
  .then(function(data) {
    var result = data //JSON.stringify(data);
    return result;
  });
}

  /** GET SINGLE STUDENT */
  function getStudent (StudId) {
    return knex.from('STUDENT')
                .select('StudId',
                        'Fname',
                        'Mname',
                        'Lname',
                        'Gender',
                        'StudAddress',
                        'Dob',
                        'Phone',
                        'Gpa',
                        'Email',
                        'SchoolId',
                        'SponsorId',
                        'JobId'
                        )
                .where({StudId:StudId})
  }
/** GET STUDENT SUBMITTED DOCS */
function getDocByStudentId(StudId, SpnId) {
  console.log('/student/stores Stud ID: ' + StudId)
  return knex.from('STUDENT')
    .where({StudId:StudId})
    .then(Student => {
      //console.dir(Student)
      return knex('SPONSOR_DOCS')
      .where({SpnId:Student[0].SponsorId})
      .then(SpnDocs => {
        //console.log('Sponsor Logs')
        //console.dir(SpnDocs)
        return knex('STUDENT_DOCS')
        .where({StudId:StudId})
         .then(StudDocs => {
          SpnDocs.map (SpnDoc => {
            //console.dir(SpnDoc)
            let foundDoc = StudDocs.find(StudDoc =>
              StudDoc.DocId === SpnDoc.DocId)

            if (foundDoc) 
              SpnDoc.FilePath = foundDoc.FilePath
              //console.log('SpnDoc')
              //console.dir(SpnDoc)
          })
          //console.log('Spn Docs')
          //console.dir(SpnDocs)
          return SpnDocs  

        }) 
      })
    })
}

/** GET EMPLOYER DOCS BY STUDENT ID */
function getJobDocByStudentId(StudId) {
  console.log('getJobDocByStudentId: ' + StudId)
  return knex.from('STUDENT').innerJoin('JOB', 'STUDENT.JobId', 'JOB.JobId')
  .where({StudId:StudId})
  .then (studentJobs => studentJobs)

}

/** GET STUDENT INFO BY JOB ID */
function getStudentByJobId(JobId) {
  console.log('getStudentByJobId: ' + JobId)
  return knex.from('STUDENT')
  .where({JobId:JobId})
  .then (student => student)
}


/** GET JOB BY STUDENT ID */
function getJobByStudentId(studId) {
return knex.from('STUDENT').innerJoin('JOB', 'STUDENT.JobId', 'JOB.JobId')
  .then (studentJobs => studentJobs)
}



/** GET STUDENTS (EMPLOYEES) FOR EMPLOYERS BASED ON JOB ID PARAMETER */

function studentsForEmployer(EmpId) {
  return knex.from('STUDENT').innerJoin('JOB', 'STUDENT.JobId', 'JOB.JobId')
  .then (employees => employees)
  //console.dir(employees)
}

/** GET STUDENTS BY JOB */

function studentByJob(jobId) {
  console.log('jobId: ',jobId)
  return knex.from('STUDENT')
                .select('StudId',
                'Fname',
                'Mname',
                'Lname',
                'Gender',
                'StudAddress',
                'Dob',
                'Phone',
                'Email',
                'SponsorId',
                'JobId'
                )
              .where({JobId:jobId})
}

  /** EDIT STUDENT*/
  // {StudId, Fname, Mname, Lname, Gender, StudAddress, Dob, Phone, Gpa, Email, SchoolId, SponsorId, JobId}
  function editStudent({StudId,Fname, Mname, Lname, Gender, StudAddress, Dob, Phone, Gpa, Email, SchoolId, SponsorId, JobId}) {
//      let { studId, Fname, Mname } = props
      //console.dir(props)
    return knex.table('STUDENT')
        .where({StudId:StudId})
        .update(
            {Fname:Fname, 
                Mname:Mname,
                Lname:Lname,
                Gender:Gender,
                StudAddress:StudAddress,
                Dob:Dob,
                Phone:Phone,
                Gpa:Gpa,
                Email:Email,
                SchoolId:SchoolId,
                SponsorId:SponsorId,
                JobId:JobId
            }) 
        .then(data => data) 
  }

/** DELETE STUDENT */
  function deleteStudent ({StudId}) {
    console.log(StudId)
    return knex.table('STUDENT')
        .where({StudId:StudId})
        .del()
        .then(data => data)
  }