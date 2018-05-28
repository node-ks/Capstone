const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        createStudentDoc:createStudentDoc,
        getStudentDocs:getStudentDocs,
        getStudentDoc:getStudentDoc,
        editStudentDoc:editStudentDoc,
        deleteDoc:deleteDoc
    }

/** CREATE DOCUMENT(S) */
  function createStudentDoc ({StudDocId, StudId, SpnId, DocId, FilePath}) {
    //console.log('createStudentDoc function called...')
    //console.log(StudId, SpnId, DocId, FilePath)
    return knex.table('STUDENT_DOCS').where({
        StudId:StudId,
        SpnId:SpnId,
        DocId:DocId,
    })
    .then( data => {
        if(data.length===0) {
          // If record does not exist, create it
          return knex('STUDENT_DOCS').insert({
              StudId:StudId,
              SpnId:SpnId,
              DocId:DocId,
              FilePath:FilePath
            })
            .then(()=>{})
        } else {
          // Record exists - modify it
          return knex('STUDENT_DOCS')
          .where({
              StudId:StudId,
              SpnId:SpnId,
              DocId:DocId
          })
          .update({
            FilePath:FilePath
          })
          .then(()=>{})
        }
      }
    )


  }

/* GET FILE PATH EXTENSION TO USE IN   function createStudentDoc   
  function getExt(FilePath){
    return (FilePath.match(/(?:.+..+[^\/]+$)/ig) != null) ? path.split('.').slice(-1): 'null';
} */

/** GET ALL DOCS */
  function getStudentDocs (StudDocId) {
        return knex.table('STUDENT_DOCS')
        .where({DocId:DocId})
        .then(function(data){
        //console.dir(data)
        var result = data
        return result;
      })
    }

  /** GET SINGLE DOC */
  function getStudentDoc(DocId) {
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
  function editStudentDoc({DocId, DocTitle, DocDescr, SpnId}) {
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