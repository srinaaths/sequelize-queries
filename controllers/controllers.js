const { movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize } = require('../models/models.js')
const { Op } = require('sequelize')
const logger = require('../logger/logger.js')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const { Client } = require('@elastic/elasticsearch')

const elasticClient = new Client({
    node: 'http://localhost:9200',
})

const jwt = require('jsonwebtoken')

const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

const connect = async () => await client.connect();

connect();

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025
})

const getCountByGenre = async (req, reply) => {
    try {
        // const data = await movie.findAll({
        //     attributes: ['movie.name', 'genre.id'],
        //     include: {
        //         model: genre,
        //         required: true,
        //         attributes: [],
        //         through: {
        //             attributes: ['genreId'],
        //             group: ['genreId']
        //         }
        //     },
        //     group: ['movie.name', 'genre.id']
        // })
        // c
        reply(data)
        // const data = await genre.findAll({
        //     attributes: [[sequelize.fn('count', sequelize.col('')), 'counttt']],
        //     group: ['id']
        // })
        reply(data)
    } catch (error) {
        reply(error.message);
    }
}

const sample = async (req, reply) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM :namee', {
            replacements: {
                namee: 'movie'
            }
        })
        logger.info('sample')
        reply(results);
        console.log(metadata);
    } catch (error) {
        logger.error('error')
        reply(error.message);
    }
}

const q10 = async (req, reply) => {
    try {
        console.log('q10 called');
        const [result, metadata] = await sequelize.query('SELECT movie.name, movie_actor.role from movie JOIN movie_actor ON (movie.id = movie_actor."movieId") WHERE movie_actor."actorId" = (SELECT id from actor where name = :name)', {
            replacements: {
                name: req.params.name
            }
        })
        reply(result);
    } catch (error) {
        reply(error.message);
    }
}

// Movie routes
// recent api's
module.exports = { createMovieEs, deleteMovieEs, getMoviesEs, searchMovieEs, getAllMovies, getCountByGenre, sample, q10, getMoviesByDirector2, getMoviesByGenre, bestReviewByMovie, addRating, addActor, addDirector, addMovie, addMovies, getMoviesByGenre2, hitMoviesByActor, worstRatedMovie2, allMoviesByActor, movieCast, moviesCountByDirectorByGenre, directorFlops, deleteMovie, updateMovie, addMovieGenre, addMovieActor, deleteActor, deleteRating, updateRating, getAllMoviesCached, getMovieById, getAllMoviesByPages, client, loginUser, isUserAuthenticated, getAllDirectors, bestRatedMovie }