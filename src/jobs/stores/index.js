const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createJob:createJob,
        getJobs:getJobs,
        getJobByEmployerId:getJobByEmployerId,
        getJobByStudentId:getJobByStudentId,
        getJob:getJob,
        editJob:editJob,
        deleteJob:deleteJob,
        editJobFilePath:editJobFilePath
    }

  function createJob ({EmpId, JobTitle, JobDescr, JobLocation, PayRate, FilePath}) {
    return knex('JOB').insert({
        EmpId:EmpId,
        JobTitle:JobTitle,
        JobDescr:JobDescr,
        JobLocation:JobLocation,
        PayRate:PayRate,
        FilePath:FilePath
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
                        'JobLocation',
                        'PayRate',
                        'Status'
                        )
                .where({JobId:JobId})
  }

  /** GET JOB BY EMPLOYER ID */
  function getJobByEmployerId(EmpId){
    return knex.from('JOB')
               .select('JobId',
                       'EmpId',
                       'JobTitle',
                       'JobDescr',
                       'JobLocation',
                       'PayRate',
                       'Status'
                      )
                .where({EmpId:EmpId})
  }
  /** GET JOB BY STUDENT ID */
  function getJobByStudentId(studId){
    return knex.from('JOB')
               .select('JobId',
                       'EmpId',
                       'JobTitle',
                       'JobDescr',
                       'JobLocation',
                       'PayRate',
                       'Status'
                      )
                .where({StudId:studId})
  }
  /** EDIT JOB */
  function editJob({JobId, JobTitle, JobDescr, JobLocation, PayRate, Status, FilePath, JobFilePath}) {
    return knex.table('JOB')
        .where({JobId:JobId})
        .update(
            {   
              JobTitle:JobTitle,
              JobDescr:JobDescr,
              JobLocation:JobLocation,
              PayRate:PayRate,
              Status:Status,
              FilePath:FilePath,
              JobFilePath:JobFilePath
            }) 
        .then(data => data) 
  }
  function editJobFilePath({JobId, JobFilePath}) {
    return knex.table('JOB')
        .where({JobId:JobId})
        .update(
            {   
              JobId:JobId,
              JobFilePath:JobFilePath
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