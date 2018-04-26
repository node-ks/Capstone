exports.up = function (knex) {
    return knex.schema
    .createTable('ROLE', function(t) {
      t.integer('RoleId')
      t.string('RoleName')
    })
    .createTable('USER_ROLE', function(t) {
        t.integer('RoleId')
        t.integer('UserId')
      })
}
exports.down = function(knex, Promise) {
    return knex.schema
    .dropTableIfExists('ROLE')
    .dropTableIfExists('USER_ROLE')
};
