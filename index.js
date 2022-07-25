const Sequelize = require('sequelize')
const { Op } = require('sequelize')
const Hapi = require('hapi')

const routes = require('./routes/routes.js')
const ratingRoutes = require('./routes/ratingRoutes.js')

const server = new Hapi.Server()

var corsHeaders = require('hapi-cors-headers')

// const regFunc = async() => {
// await server.register(require('hapi-pagination'))
// }

// regFunc();
server.connection({
    port: 8080,
    routes: {
        cors: true
    }
})

server.start(async (err) => {
    if (err)
        throw err
    await server.register(require('hapi-pagination'))
    console.log('connected');
})

server.register({plugin: require('hapi-pagination')})

server.ext('onPreResponse', corsHeaders)

server.route(routes);
server.route(ratingRoutes);

module.exports = server;