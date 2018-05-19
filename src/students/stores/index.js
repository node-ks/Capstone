const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createStudent:createStudent,
        getStudents: getStudents,
        getStudent:getStudent,
        editStudent:editStudent,
        deleteStudent:deleteStudent
    }

  function createStudent ({Fname, Mname, Lname, Gender, StudAddress, Dob, Phone, Gpa, Email, SchoolId }) {
    console.log(`Add student ${Fname, Lname}`)
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
                SchoolId:SchoolId 
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