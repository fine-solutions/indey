require('dotenv').config()
const { initServer } = require('./server/server.js')

const port = process.env.PORT || 5000
const basePath = `${process.env.BASE_PATH}/v${process.env.API_VERSION}`
const appMode = process.env.MODE

let dbUser, dbPassword, dbName, dbHost, dbPort
if (appMode === 'PRODUCTION') {
  dbUser = process.env.DB_PROD_USER
  dbPassword = process.env.DB_PROD_PASSWORD
  dbName = process.env.DB_PROD_NAME
  dbHost = process.env.DB_PROD_HOST
  dbPort = process.env.DB_PROD_PORT
} else if (appMode === 'DEBUG') {
  dbUser = process.env.DB_DEBUG_USER
  dbPassword = process.env.DB_DEBUG_PASSWORD
  dbName = process.env.DB_DEBUG_NAME
  dbHost = process.env.DB_DEBUG_HOST
  dbPort = process.env.DB_DEBUG_PORT
}

initServer(port, basePath, dbUser, dbPassword, dbName, dbHost, dbPort)
