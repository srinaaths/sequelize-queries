const { movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize } = require('../models/models.js')
const { Op } = require('sequelize')
const logger = require('../logger/logger.js')
const bcrypt = require('bcrypt')

const getRatingByUser = async (req, reply) => {
    console.log('hitting');
    console.log(req.params.id + req.params.movie);
    try {
        res = await rating.findOne({
            attributes: ['rating', 'review'],
            where: {
                userId: req.params.id,
                movieId: req.params.movie,
            }
        })
    reply(res);
    } catch (error) {
        console.log(error.message)
    }
}

const sampleRoute = (req, reply) => {
    reply('hello')
}

const preSampleRoute = (req, reply) => {
    reply('hello')
}

module.exports = { getRatingByUser , sampleRoute, preSampleRoute}