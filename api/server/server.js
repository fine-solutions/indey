const express = require('express')
const { initDatabase } = require('./database.js')
const { initRouter } = require('./router.js')

function initServer(port, path) {
  const app = express()

  initRouter(app, path, initDatabase())

  app.listen(port, () => {
    console.log(`Webserver is started and listen to port '${port}'`)
  })
}

module.exports = {
  initServer,
}
