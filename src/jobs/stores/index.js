const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createJob:createJob,
        getJobs:getJobs,
        getJob:getJob,
        editJob:editJob,
        deleteJob:deleteJob
    }

  function createJob ({ JobId, EmpId, JobTitle, JobDescr, JobLocation, PayRate}) {
    return knex('JOB').insert({
        JobId:JobId,
        EmpId:EmpId,
        JobTitle:JobTitle,
        JobDescr:JobDescr,
        Location:JobLocation,
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
                        'PayRate'
                        )
                .where({JobId:JobId})
  }

  /** EDIT JOB */
  function editJob({JobId, EmpId, JobTitle, JobDescr, JobLocation, Payrate}) {
    return knex.table('JOB')
        .where({JobId:JobId})
        .update(
            {   
                EmpId:EmpId,
                JobTitle:JobTitle,
                JobDescr:JobDescr,
                Location:JobLocation,
                PayRate:PayRate
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