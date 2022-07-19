const Sequelize = require('sequelize')
const { Op } = require('sequelize')
const Hapi = require('hapi')

const routes = require('./routes/routes.js')

const server = new Hapi.Server()

// const regFunc = async() => {
// await server.register(require('hapi-pagination'))
// }

// regFunc();
server.connection({
    port: 8080
})

server.start(async (err) => {
    if (err)
        throw err
    await server.register(require('hapi-pagination'))
    console.log('connected');
})

server.register({plugin: require('hapi-pagination')})

server.route(routes);

module.exports = server;