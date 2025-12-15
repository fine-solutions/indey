const bcrypt = require('bcrypt')
const { BaseModel, prepareWhereExpression } = require('../utils/database.js')

class User extends BaseModel {
  constructor(id=0, email, data, password = '') {
    this.id = id
    this.email = email
    this.password = password
    this.data = data
  }

  static isFieldValid(field) {
    const fields = [ 'id', 'email', 'password', 'data' ]
    return fields.includes(field)
  }

  static isValueTypeValid(field, value) {
    const valueTypes = {
      id: 'number',
      email: 'string',
      password: 'string',
      data: 'object',
    }
    return typeof value === valueTypes[field]
  }
}

/**
 * hashPassword — function for password hashing
 * 
 * @param   {string}  password    User's password
 * @param   {number}  saltRounds  Salt rounds count
 * @return  {string}              Hashed password
 */
function hashPassword(password, saltRounds = 10) {
  const salt = bcrypt.genSaltSync(saltRounds)
  return bcrypt.hashSync(password, salt)
}

/**
 * authenticate — function for user's authentication
 * 
 * @param   {object}  database  Database with users' data
 * @param   {string}  email     User's email
 * @param   {string}  password  User's password
 * @return  {boolean}           Result of email and password pair validation
 */
async function authenticate(database, email, password) {
  const filter = {
    'email': {
      '=': email
    }
  }
  const query = prepareWhereExpression(filter)
  query['text'] = `SELECT password FROM users ${query['text']}`
  query['rowMode'] = 'array'
  try {
    const result = await database.query(query)
    const hashedPassword = result.rows[0][0]
    return bcrypt.compareSync(password, hashedPassword)
  } catch (error) {
    console.error(error)
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
async function get(database, filter, page = 1) {
  const query = prepareWhereExpression(filter)
  if (page < 1) {
    throw new Error(`Value '${page}' of page parameter is not valid (minimum page is 1)`);
  }
  const limit = 100
  const startRecord = limit * (page - 1)
  query['text'] = `SELECT id, email, data FROM users ${query['text']}LIMIT ${limit} OFFSET ${startRecord}`
  query['rowMode'] = 'array'
  try {
    const result = await database.query(query)
    return result.rows.map((r) => {
      return {
        id: r[0],
        email: r[1],
        data: r[2]
      }
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * create — function for inserting a new user into database
 *
 * @param   {object}  database    Database with users' data
 * @param   {number}  saltRounds  Salt rounds count
 * @param   {string}  email       User's email
 * @param   {string}  password    User's password
 * @param   {object}  data        User's data
 * @return  {boolean}             True if insertion is successful
 */
async function create(database, saltRounds, email, password, data = null) {
  const query = {}
  const preparedPassword = hashPassword(password, saltRounds)
  const preparedData = JSON.stringify(data)
  query['text'] = `INSERT INTO users (email, password, data) VALUES ($1, $2, $3)`
  query['values'] = [ email, preparedPassword, preparedData ]
  try {
    await database.query(query)
    return true
  } catch (error) {
    if (error.detail?.includes('already exists')) {
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
 * @param   {number} saltRounds Salt rounds count
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
async function update(database, filter, saltRounds, email = null, password = null, data = null) {
  let counter = 1
  const fieldValuePattern = []
  const values = []
  if (email !== null) {
    fieldValuePattern.push(`email = \$${counter}`)
    values.push(email)
    counter++
  }
  if (password !== null) {
    fieldValuePattern.push(`password = \$${counter}`)
    values.push(hashPassword(password=password, saltRounds=saltRounds))
    counter++
  }
  if (data !== null) {
    fieldValuePattern.push(`data = \$${counter}`)
    values.push(JSON.stringify(data))
    counter++
  }

  if (counter === 1) {
    return false
  }

  const query = prepareWhereExpression(filter, counter)
  query['text'] = `UPDATE users SET ${fieldValuePattern.join(', ')} ${query['text']}`
  query['values'] = values.concat(query['values'])

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
  const query = prepareWhereExpression(filter)
  query['text'] = `DELETE users ${query['text']}`
  try {
    await database.query(query)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = {
  authenticate,
  get,
  create,
  update,
  remove,
}
