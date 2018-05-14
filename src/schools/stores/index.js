const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createSchool:createSchool,
        getSchools:getSchools,
        getSchool:getSchool,
        editSchool:editSchool,
        deleteSchool:deleteSchool
    }

  function createSchool ({SchName, SchAddress, Phone, Email, Rep}) {
    return knex('SCHOOL').insert({
        SchName:SchName,
        SchAddress:SchAddress,
        Phone:Phone,
        Email:Email,
        Rep:Rep
    })
  }

/** GET ALL SCHOOLS */
  function getSchools () {
    return knex.table('SCHOOL')
    .then(function(data) {
      var result = data //JSON.stringify(data);
      return result;
    });
  }

  /** GET SINGLE SCHOOL */
  function getSchool (SchId) {
    return knex.from('SCHOOL')
                .select('SchId',
                        'SchName',
                        'SchAddress',
                        'Phone',
                        'Email',
                        'Rep'
                        )
                .where({JobId:JobId})
  }

  /** EDIT SCHOOL */
  function editSchool({SchName, SchAddress, Phone, Email, Rep}) {
    return knex.table('SCHOOL')
        .where({SchId:SchId})
        .update(
            {   
              SchName:SchName,
              SchAddress:SchAddress,
              Phone:Phone,
              Email:Email,
              Rep:Rep
            }) 
        .then(data => data) 
  }

/** DELETE SCHOOL */
  function deleteSchool ({SchId}) {
    return knex.table('SCHOOL')
        .where({SchId:SchId})
        .del()
        .then(data => data)
  }