exports.up = function(knex) {
    return knex.schema
    .alterTable('JOB', function (t) {
        t.string('JobFilePath')
    })
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('JOB', function (t) {
        t.dropColumn('JobFilePath')
      })
};