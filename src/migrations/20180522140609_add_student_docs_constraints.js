exports.up = function(knex) {
    return
    knex.schema
    .alterTable('STUDENT_DOCS', function (t) {
        t.foreign('StudId').references('STUDENT.StudId') /* Constraint */
        t.foreign('SpnId').references('SPONSOR.SpnId') /* Constraint */
        t.foreign('DocId').references('SPONSOR_DOCS.DocId') /* Constraint */
    })
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('STUDENT_DOCS', function (t) {
        t.dropForeign('StudId')
        t.dropForeign('SpnId')
        t.dropForeign('DocId')
      })
// table.dropForeign(columns, [foreignKeyName])
};

