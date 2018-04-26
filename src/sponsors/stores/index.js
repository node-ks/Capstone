const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createSponsor:createSponsor,
        getSponsors: getSponsors,
        getSponsor:getSponsor,
        editSponsor:editSponsor,
        deleteSponsor:deleteSponsor
    }

  function createSponsor ({ SpnId, SpnName, SpnAddress, Phone, Email}) {
    return knex('SPONSOR').insert({
        SpnName:SpnName,
        SpnAddress:SpnAddress,
        Phone:Phone,
        Email:Email
    })
  }

/** GET ALL SPONSORS */
  function getSponsors () {
    return knex.table('SPONSOR')
    .then(function(data) {
      var result = data //JSON.stringify(data);
      return result;
    });
  }

  /** GET SINGLE SPONSOR */
  function getSponsor (SpnId) {
    return knex.from('SPONSOR')
                .select('SpnId',
                        'SpnName',
                        'SpnAddress',
                        'Phone',
                        'Email'
                        )
                .where({SpnId:SpnId})
  }

  /** EDIT SPONSOR*/
  function editSponsor({SpnId, SpnName, SpnAddress, Phone, Email}) {
    return knex.table('SPONSOR')
        .where({SpnId:SpnId})
        .update(
            {   
                SpnName:SpnName,
                SpnAddress:SpnAddress,
                Phone:Phone,
                Email:Email
            }) 
        .then(data => data) 
  }

/** DELETE SPONSOR */
  function deleteSponsor ({SpnId}) {
    return knex.table('SPONSOR')
        .where({SpnId:SpnId})
        .del()
        .then(data => data)
  }