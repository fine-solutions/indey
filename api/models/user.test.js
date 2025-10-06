const randomstring = require('randomstring')
const userModel = require('./user.js')

const userList = []
for (let i = 0; i < 256; i++) {
  userList.push({
    id: i + 1,
    email: `${randomstring.generate(6)}@${randomstring.generate(6)}.${randomstring.generate(3)}`
  })
}

const db = {
  users: userList
}

/**
  get()
*/
test('function get return an array with length equal or less 100', () => {
  expect(Array.isArray(userModel.get(database=db, filter={}, page=1))).toBe(true)
  for (let i = 1; i < 100; i++) {
    expect(userModel.get(database=db, filter={}, page=i).length).toBeLessThanOrEqual(100)
  }
})

test('function get return error if field for filter is not valid', () => {
  const operation = '&&'
  const field = 'name'
  const filterObject = {}
  filterObject[field] = {}
  filterObject[field][operation] = 5
  expect(() => userModel.get(database=db, filter=filterObject, page=1)).toThrow(`Field '${field}' in filter object is not valid`)
})

test('function get return error if operation for filter is not valid', () => {
  const operation = '&&'
  const field = 'id'
  const filterObject = {}
  filterObject[field] = {}
  filterObject[field][operation] = 5
  expect(() => userModel.get(database=db, filter=filterObject, page=1)).toThrow(`Operation '${operation}' for field in filter object is not compatible`)
})

test('function get return an array if operation for filter is valid', () => {
  const operations = [ '<', '<=', '=', '>', '>=', ]
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    const field = 'id'
    const filterObject = {}
    filterObject[field] = {}
    filterObject[field][operation] = 5
    expect(Array.isArray(userModel.get(database=db, filter=filterObject, page=1))).toBe(true)
  }
})

test('function get return an array if operation for filter is valid for field type', () => {
  const operations = [ '<', '<=', '>', '>=', ]
  const fields = {
    id: {
      value: 5,
      isValid: true,
    },
    email: {
      value: 'user@example.com',
      isValid: false,
    },
  }
  const fieldKeys = Object.keys(fields)
  for (let i = 0; i < operations.length; i++) {
    for (let j = 0; j < fieldKeys.length; j++) {
      const operation = operations[i];
      const field = fieldKeys[j]
      const filterObject = {}
      filterObject[field] = {}
      filterObject[field][operation] = fields[fieldKeys[j]].value
      if (fields[fieldKeys[j]].isValid) {
        expect(Array.isArray(userModel.get(database=db, filter=filterObject, page=1))).toBe(true)
      } else {
        expect(() => userModel.get(database=db, filter=filterObject, page=1)).toThrow(`Operation '${operation}' for field in filter object is not valid for field type`)
      }
    }
  }
})

test('function get return an array if type of operation value for filter is valid', () => {
  const operations = [ '<', '<=', '=', '>', '>=', ]
  const fields = {
    id: {
      value: 5,
      isValid: true,
      type: 'number'
    },
    id: {
      value: 'user@example.com',
      isValid: false,
      type: 'number'
    },
    email: {
      value: 5,
      isValid: false,
      type: 'string'
    },
    email: {
      value: 'user@example.com',
      isValid: true,
      type: 'string'
    },
  }
  const fieldKeys = Object.keys(fields)
  for (let i = 0; i < operations.length; i++) {
    for (let j = 0; j < fieldKeys.length; j++) {
      const operation = operations[i];
      const field = fieldKeys[j]
      const filterObject = {}
      filterObject[field] = {}
      filterObject[field][operation] = fields[fieldKeys[j]].value
      if (fields[fieldKeys[j]].isValid) {
        if (
          fields[fieldKeys[j]].type === 'string' && operation === '=' ||
          fields[fieldKeys[j]].type === 'number' && [ '<', '<=', '>', '>=', ].includes(operation)
        ) {
          expect(Array.isArray(userModel.get(database=db, filter=filterObject, page=1))).toBe(true)
        } else {
          expect(() => userModel.get(database=db, filter=filterObject, page=1)).toThrow(`Operation '${operation}' for field in filter object is not valid for field type`)
        }
      } else {
        expect(() => userModel.get(database=db, filter=filterObject, page=1)).toThrow(`Type of operation '${operation}' value '${fields[fieldKeys[j]].value}' in filter object is not valid`)
      }
    }
  }
})

/**
  insert()
*/
test('function insert return a new user in database with correct fields', () => {
  const userEmail = 'user@example.com'
  const result = userModel.insert(database=db, email=userEmail)
  expect(result.email).toBe(userEmail)
  expect(typeof result.id).toBe('number')
})

test('function insert return throw if user with the same email already exists', () => {
  const userEmail = 'user@example.com'
  expect(() => {
    userModel.insert(database=db, email=userEmail)
    userModel.insert(database=db, email=userEmail)
  }).toThrow(`User with the same email '${userEmail}' already exists`)
})
