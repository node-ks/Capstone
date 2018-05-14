exports.up = function (knex) {
    return knex.schema
    .createTable('SPONSOR', function(t) {
      t.increments('SpnId').primary()
      t.integer('UserId').notNullable()
      t.string('SpnName').notNullable()
      t.string('SpnAddress').notNullable()
      t.string('Phone').notNullable()
      t.string('Email').notNullable()
    })
    .createTable('SCHOOL', function(t) {
      t.increments('SchId').primary()
      t.string('SchName').notNullable()
      t.string('SchAddress').notNullable()
      t.string('Phone').notNullable()
      t.string('Email').notNullable()
      t.string('Rep')
    })
    .createTable('FACILITATOR', function(t) {
      t.increments('FacId').primary()
      t.integer('UserId').notNullable()
      t.string('Fname').notNullable()
      t.string('Mname')
      t.string('Lname').notNullable()
      t.string('Email').notNullable()
      t.string('Phone').notNullable()
    })
    .createTable('EMPLOYER', function(t) {
      t.increments('EmpId').primary()
      t.integer('UserId').notNullable()
      t.string('EmpName').notNullable()
      t.string('EmpAddress').notNullable()
      t.string('Phone').notNullable()
      t.string('Email').notNullable()
      t.string('Rep')
    })
    .createTable('JOB', function(t) {
      t.increments('JobId').primary()
      t.integer('EmpId').unsigned().notNullable()
      t.foreign('EmpId').references('EMPLOYER.EmpId') /* Constraint */
      t.string('JobTitle').notNullable()
      t.string('JobDescr').notNullable()
      t.string('Location').notNullable()
      t.float('PayRate',5,2).notNullable().defaultTo(0.00)
    })
    .createTable('STUDENT', function (t) {
      t.increments('StudId').primary()
      t.string('Fname').notNullable()
      t.string('Mname')
      t.string('Lname').notNullable()
      t.string('Gender')
      t.string('StudAddress').notNullable()
      t.date('Dob').notNullable()
      t.string('Phone')
      t.float('Gpa',5,2).notNullable().defaultTo(2.00)
      t.string('Email').notNullable()
      t.integer('SchoolId').unsigned().notNullable()
      t.foreign('SchoolId').references('SCHOOL.SchId') /* Constraint */
      t.integer('SponsorId').unsigned()
      t.foreign('SponsorId').references('SPONSOR.SpnId') /* Constraint */
      t.integer('JobId').unsigned()
      t.foreign('JobId').references('JOB.JobId') /* Constraint */
      t.integer('UserId').notNullable()
    })
    /*Change schema to match tutorial and encrypt password */
    .createTable('USER', function(t) {
      t.increments('UserId').primary()
      t.string('UserName').notNullable()
      t.unique('UserName')
      t.string('salt').notNullable()
      t.string('encrypted_password').notNullable()
      t.string('StudentId')
      t.string('SponsorId')
      t.string('EmployerId')
      t.string('FacilitatorId')
      t.timestamps(true, true)
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

  }