function getHome() {
  return (_, response) => {
    console.log('getHome() for GET request "/"')
    response.send('Hello world!')
  }
}

module.exports = {
  getHome,
}
