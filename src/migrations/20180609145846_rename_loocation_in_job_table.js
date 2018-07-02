exports.up = function(knex) {
    return knex.schema
    .alterTable('JOB', function (t) {
        t.renameColumn('Location', 'JobLocation')
    })
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('JOB', function (t) {
        t.renameColumn('JobLocation', 'Location')
      })
};
