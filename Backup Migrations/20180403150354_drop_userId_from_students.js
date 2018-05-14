exports.up = function(knex) {
    return knex.schema
    .table('STUDENT', function(t) {
        t.dropColumn('UserId');
      });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('STUDENT', function(t) {
        t.string('UserId').nullable();
     })
};
