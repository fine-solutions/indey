const { seedUser } = require('../seeders/user.js')

/**
 * createTables — function for creating of all needed tables and inflate them by default data
 * 
 * @param {object} database   Database with users' data
 * @param {array}  userList   Users' data
 */
async function createTables(database, userList, saltRounds) {
  await seedUser(database=database, userList=userList, saltRounds=saltRounds)
}

module.exports = {
  createTables
}
