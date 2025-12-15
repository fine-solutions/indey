const { create } = require('../models/user.js')

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
        password VARCHAR(255) NOT NULL,
        data JSONB,
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
 * @param {object}  database    Database with users' data
 * @param {array}   userList    Users' data
 * @param {number}  saltRounds  Salt rounds count
 */
async function inflateUsers(database, userList, saltRounds) {
  for (let i = 0; i < userList.length; i++) {
    await create(database=database, saltRounds=saltRounds, email=userList[i].email, password=userList[i].password, data=userList[i].data)
  }
}

/**
 * seedUser — function for seeding user into database
 *
 * @param {object}  database  Database with users' data
 * @param {array}   userList  Users' data
 */
async function seedUser(database, userList, saltRounds) {
  await createUserTable(database=database)
  await inflateUsers(database=database, userList=userList, saltRounds=saltRounds)
}

module.exports = {
  seedUser
}