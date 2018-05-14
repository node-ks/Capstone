
exports.up = function(knex) {
    return
    knex.schema
    .alterTable('JOB', function (t) {
        t.foreign('EmpId').references('EMPLOYER.EmpId') /* Constraint */
    })
    .alterTable('USER_ROLE', function (t) {
        t.foreign('RoleId').references('ROLE.RoleId') /* Constraint */
        t.foreign('UserId').references('USER.UserId') /* Constraint */
    })  
};

exports.down = function(knex) {
    return
    knex.schema
    .alterTable('JOB', function (t) {
        t.dropForeign('EmpId')
      })
    .alterTable('USER_ROLE', function (t) {
        t.dropForeign('RoleId')
        t.dropForeign('UserId')
      })
// table.dropForeign(columns, [foreignKeyName])
};

