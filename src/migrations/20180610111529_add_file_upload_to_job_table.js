exports.up = function(knex) {
    return knex.schema
    .alterTable('JOB', function (t) {
        t.string('FilePath')
    })
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('JOB', function (t) {
        t.dropColumn('FilePath')
      })
};