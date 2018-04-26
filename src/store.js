const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))

module.exports = {
    saltHashPassword,
    createUser ({ username, password }) {
      console.log(`Add user ${username}`)
      const {salt, hash } = saltHashPassword({password})
      return knex('USER').insert({
          UserName:username,
          encrypted_password:hash,
          salt:salt
      })
    },
    authenticate ({ username, password }) {
        console.log(`Authenticating user ${username}`)
        return knex('USER').where({ username })
          .then(([user]) => {
            //console.dir(user.username)
            //console.dir(username)
            if (!user)  return { success: false }
            const { hash } = saltHashPassword({
              password,
              salt: user.salt
            })
            return { success: hash === user.encrypted_password }
          })
      },
      getUsers: getUsers,
      getUser:getUser,
      editUser:editUser,
      deleteUser:deleteUser
  }

  function saltHashPassword ({
      password,
      salt = randomString()
    }) {
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
/** LIST ALL USERS */
  function getUsers () {
    return knex.table('USER')
    .then(function(data) {
      console.dir(data)
      var result = data //JSON.stringify(data);
      return result;
  });
  }
  /** GET SINGLE USER */
  function getUser (username) {
    return knex.from('USER')
    .select('StudentId', 'UserName')
    .where({UserName:username})
  }

  /** EDIT USER (STUDENT ID)*/
  function editUser({username, studentId}) {
    return knex.table('USER')
        .where({UserName:username})
        .update({StudentId:studentId})
        .then(data => data) 
  }

/** DELETE USER */
  function deleteUser ({username, studentId}) {
    console.log(username)
    return knex.table('USER')
        .where({UserName:username})
        .del()
        .then(data => data)
  }