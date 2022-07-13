const Sequelize = require('sequelize')
const { Op } = require('sequelize')
const Hapi = require('hapi')

const routes = require('./routes/routes.js')

const server = new Hapi.Server()

server.connection({
    port: 3000
})

server.start(err => {
    if (err)
        throw err
    console.log('connected');
})


server.route(routes);