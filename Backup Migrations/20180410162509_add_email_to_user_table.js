exports.up = function(knex) {
    return knex.schema
    .alterTable('USER', function(t) {
        t.string('Email').nullable();
     })
};

exports.down = function(knex) {
    return knex.schema
    .table('USER', function(t) {
        t.dropColumn('Email');
      });
};
