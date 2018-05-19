const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createDoc:createDoc,
        getDocs:getDocs,
        getDoc:getDoc,
        editDoc:editDoc,
        deleteDoc:deleteDoc
    }

/** CREATE DOCUMENT(S) */
  function createDoc ({DocTitle, DocDescr, SpnId}) {
    return knex('SPONSOR_DOCS').insert({
        DocTitle:DocTitle,
        DocDescr:DocDescr,
        SpnId:SpnId
    })
  }

/** GET ALL DOCS */
  function getDocs (SpnId) {
    if (SpnId === undefined) {
      return knex.table('SPONSOR_DOCS') /** List all docs (Facilitator) */
        .then(function(data) {
        var result = data //JSON.stringify(data);
        return result;
        });
      }
    else {
      return knex.table('SPONSOR_DOCS') /** List docs based on SpnId */
        .where({SpnId:SpnId})
          .then(function(data) {
          var result = data //JSON.stringify(data);
          return result;
          });
    }
  }

  /** GET SINGLE DOC */
  function getDoc (DocId) {
    return knex.from('SPONSOR_DOCS')
                .select('DocId',
                        'DocTitle',
                        'DocDescr',
                        'SpnId'
                        )
                .where({DocId:DocId})
  }

  /** EDIT DOC */
  function editDoc({DocId, DocTitle, DocDescr, SpnId}) {
    return knex.table('SPONSOR_DOCS')
        .where({DocId:DocId})
        .update(
            { DocId:DocId,  
              DocTitle:DocTitle,
              DocDescr:DocDescr,
              SpnId:SpnId
            }) 
        .then(data => data) 
  }

/** DELETE DOC */
  function deleteDoc ({DocId}) {
    return knex.table('SPONSOR_DOCS')
        .where({DocId:DocId})
        .del()
        .then(data => data)
  }