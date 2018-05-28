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
    //console.log('SpnId: ' + SpnId)
    if (SpnId === undefined) {
      /** List all docs (Facilitator) */
      /* return knex.table('SPONSOR_DOCS') 
        .then(function(data) {
        var result = data //JSON.stringify(data);
        return result;
        }); */
        return knex.table('SPONSOR_DOCS')
        .join('SpnId', 'SPONSOR_DOCS.SpnId', '=', 'SPONSOR.SpnId')
        .select('SpnId')
                  .where({SpnId:SpnId})
                  .then(function(data){
                    //console.dir(data)
                    var result = data
                    return result;
                  })
      }
    else {
      return knex.table('SPONSOR_DOCS') /** List docs based on SpnId */
      .join('SPONSOR', 'SPONSOR_DOCS.SpnId', '=', 'SPONSOR.SpnId')
        .where({"SPONSOR_DOCS.SpnId":SpnId})
          .then(function(data) {
            //console.dir(data[0].SpnName)
          var result = data //JSON.stringify(data);
          return result;

          });
    }
  }

  /** GET SINGLE DOC */
  function getDoc(DocId) {
    /* return knex.from('SPONSOR_DOCS')
        .select('DocId',
                'DocTitle',
                'DocDescr',
                'SpnId'
                )
        .where({DocId:DocId})
        .then(sponsorDocs => {
              knex.from('SPONSOR')
              .where({SpnId:sponsorDocs[0].SpnId})
              .select('SpnName')
              knex('SPONSOR').join('SpnId', 'SPONSOR_DOCS.SpnId', '=', 'SPONSOR.SpnId')
        }) */
        return knex.from('SPONSOR_DOCS')
          .join('SpnId', 'SPONSOR_DOCS.SpnId', '=', 'SPONSOR.SpnId')
          .select('SpnId', 'SpnName')
          .where({DocId:DocId})
          .then(function(data){
        //console.dir(data.SpnName)
            var result = data
            return result;
          })
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