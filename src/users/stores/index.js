const crypto = require('crypto')
const knex = require('knex')(require('../../knexfile'))

//(require('  ./knexfile'))

    module.exports = {
        saltHashPassword,
        createUser,
        authenticate,
        getUsers: getUsers,
        getUser:getUser,
        editUser:editUser,
        deleteUser:deleteUser,
        editUserRole:editUserRole,
        getUserById:getUserById,
        editUserProfileId:editUserProfileId
    }

  function createUser ({ username, password, RoleRequested }) {
    console.log(`Add user ${username}`)
    const {salt, hash } = saltHashPassword({password})
    return knex('USER').insert({
        UserName:username,
        encrypted_password:hash,
        salt:salt,
        RoleRequested:RoleRequested
    })
  }

  function authenticate ({ username, password }) {
    console.log(`Authenticating user ${username}`)
    return knex('USER').where({ username })
      .then(([user]) => {
        console.dir(user)
        if (!user)  return { success: false }
        if (user.Active === 0) return {success: false}
        const { hash } = saltHashPassword({
          password,
          salt: user.salt
        })
        return { success: hash === user.encrypted_password }
      })
  }

  function saltHashPassword ({ password, salt = randomString() }) {
    const hash = crypto
      .createHmac('sha512', salt)
      .update(password)
    return {
      salt,
      hash: hash.digest('hex')
    }
  }

  function randomString () {
    return crypto.randomBytes(4).toString('hex')
  }

/** GET ALL USERS */
  function getUsers () {
    return knex.table('USER')
    .then(function(data) {
      var result = data //JSON.stringify(data);
      return result;
    });
  }

  /** GET SINGLE USER */
  function getUser (username) {
    return knex.from('USER')
                .select('StudentId', 'UserName', 'Active', 'RoleRequested', 'UserId')
                .where({UserName:username})
  }
  /** GET USER BY ID */
  function getUserById (userid) {
    return knex.table('USER')
               .select('UserId', 'UserName', 'StudentId', 'StudentId', 'SponsorId', 'EmployerId', 'FacilitatorId')
               .where({UserId:userid})
               .then(data => data)
  }

  /** EDIT USER (STUDENT ID)*/
  function editUser({username, active, rolerequested}) {
    return knex.table('USER')
        .where({UserName:username})
        .update({Active:active, RoleRequested:rolerequested})
        .then(data => data) 
  }


  /*DELETE FUNCTION */

  /** EDIT USER TABLE USER TYPE ID */
  function editUserProfileId({userid, studentId, sponsorId, employerId, facilitatorId}) {
    console.log('Edit User Profile ID called...')
    return knex.table('USER')
    .where({UserId:userid})
    .update({StudentId:studentId, SponsorId:sponsorId, EmployerId:employerId, FacilitatorId:facilitatorId})
    .then(data => data)
  }


/** DELETE USER */
  function deleteUser ({username, studentId}) {
    console.log('Delete User Function')
    return knex.table('USER')
        .where({UserName:username})
        .del()
        .then(data => data)
  }

/*DELETE THIS FUNCTION  */
/** EDIT USER ROLE (FACILITATOR FUNCTION) */
  function editUserRole ({userid, roleid}) {
    knex.from('USER_ROLE')
                .select('UserId', 'RoleId')
                .where({UserId:userid})
                .then(data => {
                  if(data.length>0) {
                    // update data[0]
                    return knex.table('USER_ROLE')
                    .where({UserId:userid})
                    .update({RoleId:roleid})
                    .then(data => data)                  
                  }
                  else {
                    // insert
                    return knex.table('USER_ROLE')
                    .insert({RoleId:roleid, UserId:userid})
                    .then(data => data)                  
                  
                }
              })

  } 