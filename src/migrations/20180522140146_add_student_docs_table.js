exports.up = function (knex) {
    return knex.schema
        .createTable('STUDENT_DOCS', function(t) {
            t.increments('StudDocId').primary()
            t.integer('StudId')
            t.integer('SpnId')
            t.integer('DocId')
            t.string('FilePath')
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('STUDENT')
}
