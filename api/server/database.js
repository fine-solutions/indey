const randomstring = require('randomstring')

function initDatabase(userCount=256) {
  const userList = []
  for (let i = 0; i < userCount; i++) {
    userList.push({
      id: i + 1,
      email: `${randomstring.generate(6)}@${randomstring.generate(6)}.${randomstring.generate(3)}`
    })
  }
  return {
    users: userList
  }
}

module.exports = {
  initDatabase
}
