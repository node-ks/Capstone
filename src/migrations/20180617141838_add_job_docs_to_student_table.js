exports.up = function(knex) {
    return knex.schema
    .alterTable('STUDENT', function (t) {
        t.string('JobFilePath')
    })
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('STUDENT', function (t) {
        t.dropColumn('JobFilePath')
      })
};