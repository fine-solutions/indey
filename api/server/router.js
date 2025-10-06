const { Router } = require('express')

const { getHome } = require('../controllers/home.js')
const { getUsers } = require('../controllers/user.js')

function initRouter(app, basePath, db) {
  const router = Router()

  // Root ('/')
  router.get('/', getHome())

  // User
  router.get(`/user`, getUsers(database=db))

  // Initialization
  app.use(basePath, router)
}

module.exports = {
  initRouter
}