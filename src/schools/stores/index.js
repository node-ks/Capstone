const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createFacilitator:createFacilitator,
        getFacilitators:getFacilitators,
        getFacilitator:getFacilitator,
        editFacilitator:editFacilitator,
        deleteFacilitator:deleteFacilitator
    }

  function createFacilitator ({ FacId, Fname, Mname, Lname, Email, Phone}) {
    return knex('FACILITATOR').insert({
        Fname:Fname,
        Mname:Mname,
        Lname:Lname,
        Email:Email,
        Phone:Phone
    })
  }

/** GET ALL FACILITATORS */
  function getFacilitators () {
    return knex.table('FACILITATOR')
    .then(function(data) {
      var result = data //JSON.stringify(data);
      return result;
    });
  }

  /** GET SINGLE FACILITATOR */
  function getFacilitator (FacId) {
    return knex.from('FACILITATOR')
                .select('FacId',
                        'Fname',
                        'Mname',
                        'Lname',
                        'Email',
                        'Phone'
                        )
                .where({FacId:FacId})
  }

  /** EDIT FACILITATOR */
  function editFacilitator({FacId, Fname, Mname, Lname, Email, Phone}) {
    return knex.table('FACILITATOR')
        .where({FacId:FacId})
        .update(
            {   
                Fname:Fname,
                Mname:Mname,
                Lname:Lname,
                Email:Email,
                Phone:Phone
            }) 
        .then(data => data) 
  }

/** DELETE FACILITATOR */
  function deleteFacilitator ({FacId}) {
    return knex.table('FACILITATOR')
        .where({FacId:FacId})
        .del()
        .then(data => data)
  }