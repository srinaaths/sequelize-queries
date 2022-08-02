const { movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize } = require('../models/models.js')
const { Op } = require('sequelize')
const logger = require('../logger/logger.js')
const bcrypt = require('bcrypt')
const Boom = require('boom')

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

const featuredMovie = async(req, reply) => {
    try {
        const res = await movie.findOne({
            where: {
                id: Math.ceil(Math.random() * 10)
            }
        })
        reply(res);
    }
    catch(err) {
        console.log(err);
        reply(err)
    }
}

const preSampleRoute = (req, reply) => {
    reply(Boom.badRequest('u are not allowed'))
}

module.exports = { getRatingByUser , sampleRoute, preSampleRoute, featuredMovie}