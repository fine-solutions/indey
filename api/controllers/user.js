const { authenticate, get } = require('../models/user.js')

/**
 * 
 * @param   {object} database Database with users' data
 * @param   {string} email    User's email
 * @param   {string} password User's password
 * @return  {boolean}         Result of email and password pair validation
 */
function authUser(database) {
  return async (request, response) => {
    console.log('authUser() for POST request "/user"')
    if (!request.body) {
      return response.sendStatus(400)
    }
    const result = {
      authenticated: await authenticate(database=database, email=request.body.email, password=request.body.password)
    }
    response.json(result)
  }
}

/**
  getUsers — function for getting a list of 100 users

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
function getUsers(database) {
  return async (_, response) => {
    console.log('getUsers() for GET request "/user"')
    const result = await get(database=database, filter={}, page=1)
    response.json(result)
  }
}

module.exports = {
  authUser,
  getUsers
}