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

const getAllDirectors = async (req, reply) => {
    try {
        const res = await director.findAll();
        reply(res);
    } catch (error) {
        logger.error(error.message)
    }
}

const getAllMoviesByPages = async (req, reply) => {
    try {
        console.log(req.query.page);
        const page = req.query.page;
        const limit = req.query.limit;
        const result = await movie.findAll();
        const startIndex = (page - 1) * limit;
        const endIndex = (page) * limit;
        reply(result.slice(startIndex, endIndex))
    } catch (error) {
        console.log(error);
    }
}

const getAllMoviesCached = async (req, reply) => {
    try {
        const cachedResponse = await client.get('movies')
        if (cachedResponse) {
            console.log('got using cache');
            reply(JSON.parse(cachedResponse))
        }
        else {
            console.log('not found in cache');
            const data = await movie.findAll()
            const saveResult = await client.setEx('movies', 10, JSON.stringify(data));
            console.log(saveResult);
            console.log('added in cache');
            logger.info('got all movies')
            reply(data)
        }
    } catch (error) {
        logger.error('error fetching movies')
        reply(error.message);
    }
}

const getAllMovies = async (req, reply) => {
    try {
        const data = await movie.findAll()
        logger.info('got all movies')
        reply(data)
    } catch (error) {
        logger.error('error fetching movies')
        reply(error.message);
    }
}

const getMovieById = async (req, reply) => {
    try {
        const { id } = req.params;
        const cachedData = await client.get(`movie${id}`)
        if (cachedData) {
            console.log('cache hit');
            reply(JSON.parse(cachedData))
        }
        else {
            console.log('cache miss');
            const data = await movie.findOne({
                where: {
                    id: id
                }
            })
            const result = await client.setEx(`movie${id}`, 5, JSON.stringify(data))
            console.log('added to cache');
            reply(data)
        }
    } catch (error) {
        reply(error.message)
    }
}

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

const getMoviesByDirector = async (req, reply) => {
    try {
        const [result, metadata] = await sequelize.query('SELECT movie.name from movie JOIN director on (movie."directorId" = director.id) where movie."directorId" = (SELECT id from director where name = :name)', {
            replacements: {
                name: req.params.name
            }
        })
        reply(result);
    } catch (error) {
        reply(error.message);
    }
}

const getMoviesByGenre = async (req, reply) => {
    try {
        logger.info('getMoviesByGenre called')
        const [result, metadata] = await sequelize.query('SELECT movie.name from movie JOIN movie_genre ON (movie.id = movie_genre."movieId") WHERE movie_genre."genreId" = (SELECT id from genre WHERE name = :name)', {
            replacements: {
                name: req.params.name
            }
        })
        logger.info('getMoviesByGenre success')
        reply(result);
    } catch (error) {
        logger.error('getMoviesByGenre failed')
        reply(error.message);
    }
}

const getMoviesByGenre2 = async (req, reply) => {
    try {
        logger.info('getMoviesByGenre called')
        const movieGenre = req.params.name;
        const cachedData = await client.get(`moviesByGenre-${movieGenre}`);
        if (cachedData) {
            logger.info('cache hit');
            reply(JSON.parse(cachedData));
        }
        else {
            logger.info('hitting')
            const data = await movie.findAll({
                // attributes: ['name'],
                include: {
                    model: genre,
                    attributes: [],
                    where: {
                        name: req.params.name
                    },
                },
            })
            client.setEx(`moviesByGenre-${movieGenre}`, 1200, JSON.stringify(data))
            logger.info('getMoviesByGenre succesful')
            logger.info('added to cache')
            console.log('added to cache')
            reply(data)
        }
    } catch (error) {
        logger.error('getMoviesByDirector failed')
        reply(error.message);
    }
}

const getMoviesByDirector2 = async (req, reply) => {
    try {
        logger.info('getMoviesByDirector called')
        const directorName = req.params.name;
        const cachedData = await client.get(`moviesByDirector-${directorName}`)
        if (cachedData) {
            logger.info('cache hit')
            reply(JSON.parse(cachedData))
        }
        else {
            logger.info('cache miss')
            const data = await movie.findAll({
                include: {
                    model: director,
                    attributes: [],
                    where: {
                        name: req.params.name
                    },
                }
            })
            client.setEx(`moviesByDirector-${directorName}`, 1200, JSON.stringify(data))

            logger.info('cached')
            logger.info('getMoviesByDirector success')
            reply(data)
        }
    } catch (error) {
        logger.error('getMoviesByDirector failed')
        reply(error.message);
    }
}

const bestReviewByMovie = async (req, reply) => {
    try {
        logger.info('bestReviewByMovie called')
        const data = await rating.findAll({
            include: {
                model: movie,
                where: {
                    name: req.params.name
                }
            },
            order: [['rating', 'ASC']],
            limit: 1
        })
        logger.info('bestReviewByMovie success')
        reply(data)
    } catch (error) {
        logger.error('bestReviewByMovie failed')
        reply(error.message);
    }
}

const hitMoviesByActor = async (req, reply) => {
    try {
        logger.info('hitMoviesByActor called')
        const data = await movie.findAll({
            attributes: ['name'],
            include: [{
                model: actor,
                required: true,
                attributes: ['name'],
                where: {
                    name: req.params.name,
                },
            }, {
                model: rating,
                required: true,
                where: {
                    rating: {
                        [Op.gt]: 7
                    }
                }
            }]
        })
        logger.info('hitMoviesByActor success')
        reply(data)
    } catch (error) {
        logger.info('hitMoviesByActor error')
        reply(error.message);
    }
}

const worstRatedMovie2 = async (req, reply) => {
    try {
        logger.info('worstRatedMovie called')
        const cachedData = await client.get('worstRatedMovie')
        if (cachedData) {
            logger.info('cache hit')
            reply(JSON.parse(cachedData))
        }
        else {
            logger.info('cache miss')
            const result = await rating.findAll({
                attributes: ['movieId', [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
                include: {
                    attributes: [],
                    required: true,
                    model: movie,
                },
                group: ['movieId'],
                order: [[sequelize.fn('AVG', sequelize.col('rating')), 'ASC']],
                limit: 1,
            })
            const cacheData = await client.setEx('worstRatedMovie', 1200, JSON.stringify(result));
            logger.info('added to cache')
            logger.info('worstRatedMovie success')
            reply(result)
        }
    }
    catch (error) {
        logger.error('worstRatedMovie failed')
        reply(error.message);
    }
}

const bestRatedMovie = async (req, reply) => {
    try {
        logger.info('bestRatedMovies called')
        const cachedData = await client.get('bestRatedMovies')
        if (cachedData) {
            logger.info('cache hit')
            reply(JSON.parse(cachedData))
        }
        else {
            logger.info('cache miss')
            const result = await rating.findAll({
                attributes: ['movieId', [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
                include: {
                    attributes: [],
                    required: true,
                    model: movie,
                    // through: {
                    //     attributes: ['name']
                    // }
                },
                group: ['movieId'],
                order: [[sequelize.fn('AVG', sequelize.col('rating')), 'DESC']],
                limit: 5,
            })
            const cacheData = await client.setEx('bestRatedMovies', 1200, JSON.stringify(result));
            logger.info('added to cache')
            logger.info('bestRatedMovies success')
            reply(result)
        }
    }
    catch (error) {
        logger.error('worstRatedMovie failed')
        reply(error.message);
    }
}

const worstRatedMovie = async (req, reply) => {
    try {
        logger.info('worstRatedMovie called')
        const [result, metadata] = await sequelize.query('SELECT movie.name, AVG(rating.rating) from movie JOIN rating ON (movie.id = rating."movieId") GROUP BY movie.name ORDER BY AVG(rating.rating)')
        logger.info('worstRatedMovie success')
        reply(result)
    } catch (error) {
        logger.error('worstRatedMovie failed')
        reply(error.message);
    }
}

const allMoviesByActor = async (req, reply) => {
    try {
        logger.info('allMoviesByActor called')
        const data = await actor.findAll({
            include: {
                model: movie,
                required: true
            },
            where: {
                name: req.params.name
            }
        })
        logger.info('allMoviesByActor success')
        reply(data);
    } catch (error) {
        logger.error('allMoviesByActor failed')
        reply(error.message)
    }
}

const movieCast = async (req, reply) => {
    try {
        logger.info('movieCast called')
        const data = await movie.findAll({
            include: {
                model: actor,
            },
            where: {
                name: req.params.name
            }

        })
        logger.info('movieCast success')
        reply(data)
    } catch (error) {
        logger.error('movieCast error')
        reply(error.message);
    }
}

const moviesCountByDirectorByGenre = async (req, reply) => {
    try {
        logger.info('moviesCountByDirectorByGenre called')
        const [result, metadata] = await sequelize.query('SELECT genre.name, COUNT(movie.name) from movie JOIN director ON (movie."directorId" = director.id) JOIN movie_genre ON (movie.id = movie_genre."movieId") JOIN genre ON (movie_genre."genreId" = genre.id) WHERE movie."directorId" = ( SELECT id from director WHERE name = :name ) GROUP BY genre.name;', {
            replacements: {
                name: req.params.name
            }
        });
        logger.info('moviesCountByDirectorByGenre success')
        reply(result)
    } catch (error) {
        logger.error('moviesCountByDirectorByGenre failed')
        reply(error.message);
    }
}

const directorFlops = async (req, reply) => {
    try {
        logger.info('directorFlops called')
        const [result, metadata] = await sequelize.query('SELECT director.name, COUNT(director.name) from ( select rating."movieId", avg(rating.rating) , movie.name from rating join movie on (movie.id = rating."movieId") group by rating."movieId", movie.name having avg(rating.rating) < 6 order by avg(rating.rating) ) as intermediate_table JOIN movie on(intermediate_table."movieId" = movie.id) JOIN director ON (movie."directorId" = director.id)  GROUP BY director.name ORDER BY COUNT(director.name) DESC');
        logger.info('directorFlops success')
        reply(result)
    } catch (error) {
        logger.info('directorFlops failed')
        reply(error.message);
    }
}

// Movie routes
const addMovie = async (req, reply) => {
    try {
        logger.info('addMovie called')
        const data = await movie.create(req.payload);
        logger.info('addMovie success')
        reply('success')
    } catch (error) {
        logger.error('addMovie failed')
        reply(error.message);
        console.log(error);
    }
}

const createMovieEs = async (req, reply) => {
    try {
        const result = await elasticClient.index({
            index: "movies",
            document: {
                name: req.payload.name,
                directorId: req.payload.directorId, 
            }
        })
        reply(result)
    } catch (error) {
        logger.error('addMovie failed')
        reply(error.message);
        console.log(error);
    }
}
const deleteMovieEs = async (req, reply) => {
    try {
        const result = await elasticClient.delete({
            index: "movies",
            id: req.params.id
          });
          reply(result);
    } catch (error) {
        logger.error('addMovie failed')
        reply(error.message);
        console.log(error);
    }
}
const searchMovieEs = async (req, reply) => {
    try {
        const result = await elasticClient.search({
            index: "movies",
            query: { fuzzy: { name: req.params.name } },
          });
          reply(result)
    } catch (error) {
        logger.error('addMovies failed')
        reply(error.message);
    }
}

const addMovies = async (req, reply) => {
    try {
        logger.info('addMovies called')
        console.log(req.payload);
        const data = await movie.bulkCreate(req.payload);
        logger.info('addMovies success')
        reply('success')
    } catch (error) {
        logger.error('addMovies failed')
        reply(error.message);
    }
}
const getMoviesEs = async (req, reply) => {
    try {
        const result = await elasticClient.search({
            index: "movies",
            query: { match_all: {} },
          });
          reply(result)
    } catch (error) {
        logger.error('addMovies failed')
        reply(error.message);
    }
}

const deleteMovie = async (req, reply) => {
    try {
        logger.info('deleteMovie called')
        const result = await movie.destroy({
            where: {
                id: req.params.id
            }
        })
        if (!result) {
            logger.info('deleteMovie record not found')
            reply('movie not found')
        }
        else {
            logger.error('deleteMovie success')
            reply('deleted')
        }
    } catch (error) {
        logger.error('deleteMovie failed')
        reply(error.message);
    }
}

const updateMovie = async (req, reply) => {
    try {
        logger.info('updateMovie called')
        const data = await movie.update(
            req.payload,
            {
                where: {
                    id: req.params.id
                }
            }
        )
        logger.info('updateMovie success')
        reply('updated')
    } catch (error) {
        logger.error('updateMovie failed')
        reply(error.message);
    }
}

const addActor = async (req, reply) => {
    try {
        logger.info('addActor called')
        const result = await actor.create(req.payload)
        logger.info('addActor success')
        reply('added')
    } catch (error) {
        logger.error('addActor success')
        reply(error.message);
    }
}

const addDirector = async (req, reply) => {
    try {
        logger.info('addDirector called')
        const result = await director.create(req.payload)
        logger.info('addDirector success')
        reply('added')
    } catch (error) {
        logger.error('addDirector failed')
        reply(error.message);
    }
}

const verifyJWT = async (req, reply) => {
    const token = req.headers['x-access-token']
    if (!token) {
        reply('we need a token')
    }
    else {
        jwt.verify(token, 'jwtsecret', (err, decoded) => {
            if (err) {
                console.log(err.message);
                reply({
                    auth: false,
                    message: 'u failed to authenticate'
                })
            } else {
                req.userId = decoded.id;
                reply({
                    userId: decoded.id,
                    isAuthenticated: true,
                    message: 'succesfully authenticated'
                })
            }
        })
    }
}

const isUserAuthenticated = async (req, reply) => {
    logger.info('isUserAuthenticated called')
    verifyJWT(req, reply);
}

const loginUser = async (req, reply) => {
    const userData = req.payload;
    logger.info('loginUser called')
    logger.info(userData.name)
    logger.info(userData.password)
    try {
        const result = await user.findOne(
            {
                where: {
                    name: userData.name
                },
            }
        )
        logger.info(result)
        if (result === null) {
            logger.info('user not found');
            reply({
                auth: false,
                message: 'no user exists'
            })
        }
        else {
            logger.info('user Found');
            const passwordInDb = result.password;
            console.log('pass in db is ' + passwordInDb);
            const passwordMatch = await bcrypt.compare(userData.password, passwordInDb)
            logger.info(passwordMatch)
            if (passwordMatch) {
                const id = result.id;
                const token = jwt.sign({ id }, 'jwtsecret', {
                    expiresIn: 3000
                })
                logger.info('passwords match successful login')
                reply({
                    auth: true,
                    token: token,
                    result: result
                })
            }
            else {
                reply({
                    auth: false,
                    message: 'wrong user password'
                })
            }
        }
    } catch (error) {
        logger.error(error.message)
    }
}

const addRating = async (req, reply) => {
    try {
        logger.info('addRating called')
        const findExisting = await rating.destroy({
            where: {
                movieId: req.payload.movieId,
                userId: req.payload.userId,
            }
        }
        )
        const data = await rating.create(req.payload);
        logger.info('addRating success')
        reply('rating added')
    } catch (error) {
        console.log(error);
        logger.error('addRating error')
        reply(error.message);
    }
}

// recent api's

const addMovieGenre = async (req, reply) => {
    try {
        logger.info('addMovieGenre called')
        const data = await movie_genre.create(req.payload);
        logger.info('addMovieGenre success')
        reply('added')
    } catch (error) {
        logger.error('addMovieActor error')
        reply(error.message)
    }
}

const addMovieActor = async (req, reply) => {
    try {
        logger.info('addMovieActor called')
        const data = await movie_actor.create(req.payload);
        logger.info('addMovieActor success')
        reply('added')
    } catch (error) {
        logger.error('addMovieActor failed')
        reply(error.message)
    }
}

const deleteActor = async (req, reply) => {
    try {
        logger.info('deleteActor called')
        const data = await actor.findOne({
            where: {
                id: req.params.id
            }
        })
        if (data) {
            actor.destroy({
                where: {
                    id: req.params.id
                }
            })
            logger.info('deleteActor success')
            reply('deleted')
        }
        else {
            logger.warn('deleteActor record not found')
            reply('no actor found')
        }
    } catch (error) {
        logger.error('deleteActor failed')
        reply(error.message)
    }
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

module.exports = { createMovieEs, deleteMovieEs, getMoviesEs, searchMovieEs, getAllMovies, getCountByGenre, sample, q10, getMoviesByDirector2, getMoviesByGenre, bestReviewByMovie, addRating, addActor, addDirector, addMovie, addMovies, getMoviesByGenre2, hitMoviesByActor, worstRatedMovie2, allMoviesByActor, movieCast, moviesCountByDirectorByGenre, directorFlops, deleteMovie, updateMovie, addMovieGenre, addMovieActor, deleteActor, deleteRating, updateRating, getAllMoviesCached, getMovieById, getAllMoviesByPages, client, loginUser, isUserAuthenticated, getAllDirectors, bestRatedMovie }