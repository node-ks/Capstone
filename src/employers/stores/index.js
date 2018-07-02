const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createEmployer:createEmployer,
        getEmployers: getEmployers,
        getEmployer:getEmployer,
        editEmployer:editEmployer,
        deleteEmployer:deleteEmployer,
        getJobDetailsByJobId:getJobDetailsByJobId
    }

  function createEmployer ({ EmpId, EmpName, EmpAddress, Phone, Email, Rep}) {
    return knex('EMPLOYER').insert({
        EmpName:EmpName,
        EmpAddress:EmpAddress,
        Phone:Phone,
        Email:Email,
        Rep:Rep
    })
  }

/** GET ALL EMPLOYERS */
  function getEmployers () {
    return knex.table('EMPLOYER')
    .then(function(data) {
      var result = data //JSON.stringify(data);
      return result;
    });
  }

  /** GET SINGLE EMPLOYER */
  function getEmployer (EmpId) {
    return knex.from('EMPLOYER')
                .select('EmpId',
                        'EmpName',
                        'EmpAddress',
                        'Phone',
                        'Email',
                        'Rep'
                        )
                .where({EmpId:EmpId})
  }

  /** EDIT EMPLOYER */
  function editEmployer({EmpId, EmpName, EmpAddress, Phone, Email, Rep}) {
    return knex.table('EMPLOYER')
        .where({EmpId:EmpId})
        .update(
            {   
                EmpName:EmpName,
                EmpAddress:EmpAddress,
                Phone:Phone,
                Email:Email,
                Rep:Rep
            }) 
        .then(data => data) 
  }

/** DELETE EMPLOYER */
  function deleteEmployer ({EmpId}) {
    return knex.table('EMPLOYER')
        .where({EmpId:EmpId})
        .del()
        .then(data => data)
  }
  /** GET JOB DETAILS BY EMPLOYER ID */
function getJobDetailsByJobId(JobId) {
  //console.log('getJobDetailsByEmployerId: ' + EmpId)
  return knex.from('JOB')
  .where({JobId:JobId})
  .then (jobDetails => jobDetails)
}