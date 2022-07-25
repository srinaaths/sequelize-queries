const {getRatingByUser, sampleRoute, preSampleRoute} = require('../controllers/ratingControllers.js')

const routes = [{
    method: 'GET',
    path: '/getratingbyuser/{id}/{movie}',
    config: {
        handler: getRatingByUser
    }
}, {
    method: 'GET',
    path: '/sampleroute',
    handler: sampleRoute,
    config: {
        pre: [{method: preSampleRoute}]
    }
}]

module.exports = routes