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

const deleteRating = async (req, reply) => {
    try {
        logger.info('deleteRating called')
        const result = await rating.destroy({
            where: {
                id: req.params.id
            }
        })
        if (result) {
            logger.info('deleteRating success')
            reply("deleted")
        }
        else {
            logger.warn('deleteRating record not found')
            reply('not record found')
        }
    } catch (error) {
        logger.error('deleteRating record not found')
        reply(error.message)
    }
}

const updateRating = async (req, reply) => {
    try {
        logger.info('updateRating called')
        const data = await rating.update(req.payload, {
            where: {
                id: req.params.id
            }
        })
        logger.info('updateRating success')
        reply('updated')
    } catch (error) {
        logger.error('updateRating failed')
        reply(error.message)
    }
}


module.exports = { getRatingByUser , sampleRoute, preSampleRoute, featuredMovie}