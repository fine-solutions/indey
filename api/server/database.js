const { Client } = require('pg')

async function initDatabase(username, password, database, host='localhost', port=5432) {
  const client = new Client({
    user: username,
    password: password,
    database: database,
    host: host,
    port: port,
  })

  try {
    await client.connect()
  } catch (err) {
    console.error(err)
    return undefined
  }

  return client
}

module.exports = {
  initDatabase
}
