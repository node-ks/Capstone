exports.up = function(knex) {
    return knex.schema
    .alterTable('STUDENT', function (t) {
        t.string('FilePath')
    })
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('STUDENT', function (t) {
        t.dropColumn('FilePath')
      })
};