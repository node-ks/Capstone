exports.up = function (knex) {
    return knex.schema
    .createTable('SPONSOR', function(t) {
      t.increments('SpnId').primary()
      t.string('SpnName')
      t.string('SpnAddress')
      t.string('Phone')
      t.string('Email')
    })
    .createTable('SCHOOL', function(t) {
      t.increments('SchId').primary()
      t.string('SchName')
      t.string('SchAddress')
      t.string('Phone')
      t.string('Email')
      t.string('Rep')
    })
    .createTable('FACILITATOR', function(t) {
      t.increments('FacId').primary()
      t.string('Fname')
      t.string('Mname')
      t.string('Lname')
      t.string('Email')
      t.string('Phone')
    })
    .createTable('EMPLOYER', function(t) {
      t.increments('EmpId').primary()
      t.string('EmpName')
      t.string('EmpAddress')
      t.string('Phone')
      t.string('Email')
      t.string('Rep')
    })
    .createTable('JOB', function(t) {
      t.increments('JobId').primary()
      t.integer('EmpId')
      t.string('JobTitle')
      t.string('JobDescr')
      t.string('Location')
      t.float('PayRate',5,2).notNullable().defaultTo(0.00)
      t.boolean('Status').defaultTo(false)
    })
    .createTable('STUDENT', function (t) {
      t.increments('StudId').primary()
      t.string('Fname')
      t.string('Mname')
      t.string('Lname')
      t.string('Gender')
      t.string('StudAddress')
      t.date('Dob')
      t.string('Phone')
      t.float('Gpa',5,2).notNullable().defaultTo(2.00)
      t.string('Email')
      t.integer('SchoolId')
      t.integer('SponsorId')
      t.integer('JobId')
    })
    /*Change schema to match tutorial and encrypt password */
    .createTable('USER', function(t) {
      t.increments('UserId').primary()
      t.string('UserName').notNullable()
      t.unique('UserName')
      t.string('salt').notNullable()
      t.string('encrypted_password').notNullable()
      t.string('PersonId')
      t.timestamps(true, true)
      t.string('Email')
      t.boolean('Active').defaultTo(false)
      t.string('RoleRequested')
    }) 
    .createTable('ROLE', function(t) {
      t.integer('RoleId')
      t.string('RoleName')
    })
    .createTable('USER_ROLE', function(t) {
      t.integer('RoleId')
      t.integer('UserId')
    })
}
  exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('STUDENT')
    .dropTableIfExists('JOB')
    .dropTableIfExists('USER')
    .dropTableIfExists('EMPLOYER')
    .dropTableIfExists('FACILITATOR')
    .dropTableIfExists('SPONSOR')
    .dropTableIfExists('SCHOOL')
    .dropTableIfExists('ROLE')
    .dropTableIfExists('USER_ROLE')
  }


// t.foreign('EmpId').references('EMPLOYER.EmpId') /* Constraint */
// t.foreign('RoleId').references('ROLE.RoleId') /* Constraint */
// t.foreign('UserId').references('USER.UserId') /* Constraint */
