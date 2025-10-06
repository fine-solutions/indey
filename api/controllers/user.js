const { request, response } = require('express')
const userModel = require('../models/user.js')

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
function getUsers(database, filter={}, page=1) {
  return (request, response) => {
    response.json(userModel.get(database, filter=filter, page=page))
  }
}

module.exports = {
  getUsers
}