function getHome() {
  return (_, response) => {
    response.send('Hello world!')
  }
}

module.exports = {
  getHome,
}
