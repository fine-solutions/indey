const express = require('express')
const { initDatabase } = require('./database.js')
const { initRouter } = require('./router.js')

async function initServer(appPort, appPath, dbUser, dbPassword, dbName, dbHost, dbPort) {
  const app = express()

  const db = await initDatabase(
    username=dbUser,
    password=dbPassword,
    database=dbName,
    host=dbHost,
    port=dbPort
  )

  if (db) {
    console.log(`Database is connected on '${dbHost}:${dbPort}...'`)
    initRouter(app, appPath, db)

    app.listen(appPort, () => {
      console.log(`Webserver is started and listen to port '${appPort}...'`)
    })
  }
}

module.exports = {
  initServer,
}
