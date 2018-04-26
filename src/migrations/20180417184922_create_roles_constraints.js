exports.up = function(knex, Promise) {
    return
    knex.schema.alterTable('USER_ROLE', function (t) {
        t.foreign('RoleId').references('ROLE.RoleId')
        t.foreign('UserId').references('USER.UserId')
      })
};

exports.down = function(knex, Promise) {

    return
    knex.schema.alterTable('USER_ROLE', function (t) {
        t.dropForeign('RoleId')
        t.dropForeign('UserId')
      })
// table.dropForeign(columns, [foreignKeyName])
};

