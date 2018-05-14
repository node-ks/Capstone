const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createJob:createJob,
        getJobs:getJobs,
        getJob:getJob,
        editJob:editJob,
        deleteJob:deleteJob
    }

  function createJob ({EmpId,JobTitle, JobDescr, JobLocation, PayRate, Status}) {
    return knex('JOB').insert({
        EmpId:EmpId,
        JobTitle:JobTitle,
        JobDescr:JobDescr,
        Location:JobLocation,
        PayRate:PayRate,
        Status:Status
    })
  }

/** GET ALL JOBS */
  function getJobs () {
    return knex.table('JOB')
    .then(function(data) {
      var result = data //JSON.stringify(data);
      return result;
    });
  }

  /** GET SINGLE JOB */
  function getJob (JobId) {
    return knex.from('JOB')
                .select('JobId',
                        'EmpId',
                        'JobTitle',
                        'JobDescr',
                        'Location',
                        'PayRate',
                        'Status'
                        )
                .where({JobId:JobId})
  }

  /** EDIT JOB */
  function editJob({JobTitle, JobDescr, JobLocation, PayRate, Status}) {
    return knex.table('JOB')
        .where({JobId:JobId})
        .update(
            {   
              JobTitle:JobTitle,
              JobDescr:JobDescr,
              Location:JobLocation,
              PayRate:PayRate,
              Status:Status
            }) 
        .then(data => data) 
  }

/** DELETE JOB */
  function deleteJob ({JobId}) {
    return knex.table('JOB')
        .where({JobId:JobId})
        .del()
        .then(data => data)
  }