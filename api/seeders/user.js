const { insert } = require('../models/user.js')

/**
 * createUserTable — function for creating of user's table into database
 *
 * @param {object} database 
 */
async function createUserTable(database) {
  try {
    const query = `
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    await database.query(query)
    console.log(`Table 'users' has been created successfully.`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * inflateUsers — function for inserting a list of users into database
 *
 * @param {object}  database   Database with users' data
 * @param {array}   userList   Users' data
 */
async function inflateUsers(database, userList) {
  for (let i = 0; i < userList.length; i++) {
    await insert(database=database, email=userList[i].email)
  }
}

/**
 * seedUser — function for seeding user into database
 *
 * @param {object}  database  Database with users' data
 * @param {array}   userList  Users' data
 */
async function seedUser(database, userList) {
  await createUserTable(database=database)
  await inflateUsers(database=database, userList=userList)
}

module.exports = {
  seedUser
}