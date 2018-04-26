exports.up = function(knex) {
    return knex.schema
    .alterTable('USER', function(t) {
        t.boolean('Active').defaultTo(false),
        t.string('RoleRequested')
     })
};

exports.down = function(knex) {
    return knex.schema
    .table('USER', function(t) {
        t.dropColumn('Active'),
        t.dropColumn('RoleRequested')
      });
};
