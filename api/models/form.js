const { BaseModel, prepareWhereExpression } = require('../utils/database.js')

class Form extends BaseModel {
  constructor(id=0, type, data, author, created_at, updated_at) {
    this.id = id
    this.type = type
    this.data = data
    this.author = author
    this.created_at = created_at
    this.updated_at = updated_at
  }

  static isFieldValid(field) {
    const fields = [ 'id', 'type', 'data', 'author', 'created_at', 'updated_at' ]
    return fields.includes(field)
  }

  static isValueTypeValid(field, value) {
    const valueTypes = {
      id: 'number',
      type: 'string',
      data: 'object',
      author: 'number',
      created_at: 'string',
      updated_at: 'string',
    }
    return typeof value === valueTypes[field]
  }
}

/**
 * get — function for getting a list of 100 forms from database
 *
 * @param {object} database   Database with forms' data
 * @param {object} filter     An object for filtering of forms
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
 * @return {Array}            Array of user objects (Form)
 */
async function get(database, filter, page) {
  const query = prepareWhereExpression(filter)
  if (page < 1) {
    throw new Error(`Value '${page}' of page parameter is not valid (minimum page is 1)`);
  }
  const limit = 100
  const startRecord = limit * (page - 1) + 1
  const endRecord = startRecord + limit - 1
  query['text'] = `SELECT type, data, author, created_at, updated_at FROM forms ${query['text']} LIMIT ${startRecord},${endRecord}`
  query['rowMode'] = 'array'
  try {
    const response = await database.query(query)
    return response.rows.map((r) => {
      return Form(type=r[0], data=r[1], author=r[2], created_at=r[3], updated_at=r[4])
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * create — function for inserting a new user into database
 *
 * @param {object}   database Database with forms' data
 * @param {string}   type     Form's type
 * @param {object}   data     Form's data
 * @param {number}   author   Form's author ID
 * @return {boolean}          True if insertion is successful
 */
async function create(database, type, data, author) {
  const query = {}
  query['text'] = `INSERT INTO forms (type, data, author) VALUES ($1, $2, $3)`
  query['values'] = [ type, data, author ]
  try {
    await database.query(query)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * update — function for updating forms from database by filter
 *
 * @param {object}  database Database with forms' data
 * @param {object}  filter   An object for filtering of forms
  *                           in following format:
  *                           `{ field: { operation: value } }`.
  *                           
  *                           Example:
  *                           {
  *                             id: {
  *                               '=': 5,
  *                             },
  *                           }
 * @param {string}  type      Form's type
 * @param {object}  data      Form's data
 * @param {number}  author    Form's author ID
 * @return {boolean}          True if updating is successful
 */
async function update(database, filter, type = '', data, author = 0) {
  let query
  if (type === '' && author === 0) {
    query = prepareWhereExpression(filter, 2)
    query['text'] = `UPDATE forms SET data = $1 ${query['text']}`
    query['values'] = [ JSON.stringify(data) ].concat(query['values'])
  } else if (type === '') {
    query = prepareWhereExpression(filter, 3)
    query['text'] = `UPDATE forms SET data = $1, author = $2 ${query['text']}`
    query['values'] = [ JSON.stringify(data), author ].concat(query['values'])
  } else if (author === 0) {
    query = prepareWhereExpression(filter, 3)
    query['text'] = `UPDATE forms SET type = $1, data = $2 ${query['text']}`
    query['values'] = [ type, JSON.stringify(data) ].concat(query['values'])
  } else {
    query = prepareWhereExpression(filter, 4)
    query['text'] = `UPDATE forms SET type = $1, data = $2, author = $3 ${query['text']}`
    query['values'] = [ type, JSON.stringify(data), author ].concat(query['values'])
  }
  try {
    await database.query(query)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * remove — function for removing forms from database by filter
 *
 * @param {object} database   Database with forms' data
 * @param {object} filter     An object for filtering of forms
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
  query['text'] = `DELETE forms ${query['text']}`
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
