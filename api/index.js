require('dotenv').config()
const { initServer } = require('./server/server.js')

const port = process.env.PORT || 5000
const basePath = `${process.env.BASE_PATH}/v${process.env.API_VERSION}`

initServer(port, basePath)
