const { getRatingByUser, sampleRoute, preSampleRoute, featuredMovie } = require('../controllers/ratingControllers.js')

const routes = [{
    method: 'GET',
    path: '/getratingbyuser/{id}/{movie}',
    config: {
        handler: getRatingByUser
    }
}, 
{
    method: 'GET',
    path: '/sampleroute',
    handler: sampleRoute,
    config: {
        pre: [{ method: preSampleRoute }]
    }
},
{
    method: 'GET',
    path: '/featuredMovie',
    handler: featuredMovie,
}
]

module.exports = routes