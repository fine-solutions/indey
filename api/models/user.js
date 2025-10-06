function isFieldAvailable(field) {
  const user = {
    id: 0,
    email: '',
  }
  return Object.keys(user).includes(field)
}

/**
  get — function for getting a list of 100 users from database

  @param database   Database with users' data
  @param page       Number  a page number (minimum page is 1)
  @param filter     Object  an object for filtering of users
                        in following format:
                        `{ field: { operation: value } }`.
                        
                        Example:
                        {
                          id: {
                            '=': 5,
                          },
                        }
  @return       Array   Array of user objects (User Model)
 */
function get(database, filter, page) {
  const limit = 100
  const filterKeys = Object.keys(filter)
  let filteredUsers = []
  if (database.users.length === 0) {
    return []
  }
  if (filterKeys.length === 0) {
    filteredUsers = database.users
  } else {
    for (let i = 0; i < filterKeys.length; i++) {
      if (isFieldAvailable(filterKeys[i])) {
        filteredUsers = database.users.filter((user) => {
          const operations = Object.keys(filter[filterKeys[i]])
          if (operations.length === 0) {
            return true
          } else {
            let result = true
            for (let j = 0; j < operations.length; j++) {
              switch (operations[j]) {
                case '<':
                  if (typeof user[filterKeys[i]] === 'number') {
                    if (typeof filter[filterKeys[i]][operations[j]] !== 'number') {
                      throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
                    }
                    result = result && user[filterKeys[i]] < filter[filterKeys[i]][operations[j]]
                  } else {
                    throw new Error(`Operation '${operations[j]}' for field in filter object is not valid for field type`)
                  }
                  break
                case '<=':
                  if (typeof user[filterKeys[i]] === 'number') {
                    if (typeof filter[filterKeys[i]][operations[j]] !== 'number') {
                      throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
                    }
                    result = result && user[filterKeys[i]] <= filter[filterKeys[i]][operations[j]]
                  } else {
                    throw new Error(`Operation '${operations[j]}' for field in filter object is not valid for field type`)
                  }
                  break
                case '=':
                  if (typeof filter[filterKeys[i]][operations[j]] !== typeof user[filterKeys[i]]) {
                    throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
                  }
                  result = result && user[filterKeys[i]] === filter[filterKeys[i]][operations[j]]
                  break
                case '>':
                  if (typeof user[filterKeys[i]] === 'number') {
                    if (typeof filter[filterKeys[i]][operations[j]] !== 'number') {
                      throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
                    }
                    result = result && user[filterKeys[i]] > filter[filterKeys[i]][operations[j]]
                  } else {
                    throw new Error(`Operation '${operations[j]}' for field in filter object is not valid for field type`)
                  }
                  break
                case '>=':
                  if (typeof user[filterKeys[i]] === 'number') {
                    if (typeof filter[filterKeys[i]][operations[j]] !== 'number') {
                      throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
                    }
                    result = result && user[filterKeys[i]] >= filter[filterKeys[i]][operations[j]]
                  } else {
                    throw new Error(`Operation '${operations[j]}' for field in filter object is not valid for field type`)
                  }
                  break
                default:
                  throw new Error(`Operation '${operations[j]}' for field in filter object is not compatible`)
              }
            }
            return result
          }
        })
      } else {
        throw new Error(`Field '${filterKeys[i]}' in filter object is not valid`)
      }
    }
  }
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return filteredUsers.slice(startIndex, endIndex)
}

/**
  insert — function for inserting a new user into database

  @param database   Database with users' data
  @param email      String  user email
  @return           Object  user object (User Model)
 */
function insert(database, email) {
  let id = 1
  for (let i = 0; i < database.users.length; i++) {
    if (database.users[i].email === email) {
      throw new Error(`User with the same email '${email}' already exists`)
    }
    if (database.users[i].id > id) {
      id = database.users[i].id
    }
  }
  database.users.push({
    id: id + 1,
    email: email,
  })
  return database.users[database.users.length - 1]
}

module.exports = {
  get,
  insert,
}
