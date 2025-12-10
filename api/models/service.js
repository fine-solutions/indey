const { BaseModel, prepareWhereExpression } = require('../utils/database.js')

class User extends BaseModel {
  constructor(id=0, email) {
    this.id = id
    this.email = email
  }

  static isFieldValid(field) {
    const fields = [ 'id', 'email' ]
    return fields.includes(field)
  }

  static isValueTypeValid(field, value) {
    const valueTypes = {
      id: 'number',
      email: 'string',
    }
    return typeof value === valueTypes[field]
  }
}

/**
 * get — function for getting a list of 100 users from database
 *
 * @param {object} database   Database with users' data
 * @param {object} filter     An object for filtering of users
 *                            in following format:
 *                            `{ field: { operation: value } }`.
 *                            
 *                            Example:
 *                            {
 *                              id: {
 *                                '=': 5,
 *                              },
 *                            }
 * @param {number} page       A page number (minimum page is 1)
 * @return {Array}            Array of user objects (User)
 */
async function get(database, filter, page) {
  const query = prepareWhereExpression(filter)
  if (page < 1) {
    throw new Error(`Value '${page}' of page parameter is not valid (minimum page is 1)`);
  }
  const limit = 100
  const startRecord = limit * (page - 1) + 1
  const endRecord = startRecord + limit - 1
  query['text'] = `SELECT id, email FROM users ${query['text']} LIMIT ${startRecord},${endRecord}`
  query['rowMode'] = 'array'
  try {
    const response = await database.query(query)
    return response.rows.map((r) => {
      return User(id=r[0], email=r[1])
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * create — function for inserting a new user into database
 *
 * @param {object}   database  Database with users' data
 * @param {string}   email     User's email
 * @return {boolean}           True if insertion is successful
 */
async function create(database, email) {
  const query = {}
  query['text'] = `INSERT INTO users (email) VALUES ($1)`
  query['values'] = [ email ]
  try {
    await database.query(query)
    return true
  } catch (error) {
    if (error.detail.includes('already exists')) {
      console.error(`User with the same email '${email}' already exists`)
    } else {
      console.error(error)
    }
    return false
  }
}

/**
 * update — function for updating users from database by filter
 *
 * @param   {object} database   Database with users' data
 * @param   {object} filter     An object for filtering of users
  *                             in following format:
  *                             `{ field: { operation: value } }`.
  *                             
  *                             Example:
  *                             {
  *                               id: {
  *                                 '=': 5,
  *                               },
  *                             }
 * @param   {string} email      User's email
 * @return  {boolean}           True if updating is successful
 */
async function update(database, filter, email) {
  const query = prepareWhereExpression(filter, 2)
  query['text'] = `UPDATE users SET email = $1 ${query['text']}`
  query['values'] = [ email ].concat(query['values'])
  try {
    await database.query(query)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * remove — function for removing users from database by filter
 *
 * @param {object} database   Database with users' data
 * @param {object} filter     An object for filtering of users
 *                            in following format:
 *                            `{ field: { operation: value } }`.
 *                            
 *                            Example:
 *                            {
 *                              id: {
 *                                '=': 5,
 *                              },
 *                            }
 * @return {boolean}          True if removing is successful
 */
async function remove(database, filter) {
  const query = prepareWhereExpression(filter, 2)
  query['text'] = `UPDATE users SET email = $1 ${query['text']}`
  query['values'] = [ email ].concat(query['values'])
  try {
    await database.query(query)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
}
