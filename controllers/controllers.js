const {movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize} = require('../models/models.js')
const {Op} = require('sequelize')


const getAllMovies = async (req, reply) => {
    try {
        const data = await movie.findAll()
        reply(data)
    } catch (error) {
        reply(error.message);
    }
}

const getCountByGenre = async (req, reply) => {
    try {
        // const data = await movie.findAll({
        //     attributes: ['movie.name', 'genre.id'],
        //     include: {
        //         model: genre,
        //         required: true,
        //         attributes: ['id'],
        //         through: {
        //             attributes: ['genreId'],
        //             group: ['genreId']
        //         }
        //     },
        //     group: ['movie.name', 'genre.id']
        // })
        // reply(data)
        // const data = await genre.findAll({
        //     attributes: [[sequelize.fn('count', sequelize.col('')), 'counttt']],
        //     group: ['id']
        // })
        // reply(data)
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
        reply(results);
        console.log(metadata);
    } catch (error) {
        reply(error.message);
    }
}

const q10 = async (req, reply) => {
    try {
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
        const [result, metadata] = await sequelize.query('SELECT movie.name from movie JOIN movie_genre ON (movie.id = movie_genre."movieId") WHERE movie_genre."genreId" = (SELECT id from genre WHERE name = :name)', {
            replacements: {
                name: req.params.name
            }
        })
        reply(result);
    } catch (error) {
        reply(error.message);
    }
}

const getMoviesByGenre2 = async (req, reply) => {
    try {
        const data = await movie.findAll({
            attributes: ['name'],
            include: {
                model: genre,
                where: {
                    name: req.params.name
                },
                attributes: ['name']
            }
        })
        reply(data)
    } catch (error) {
        reply(error.message);
    }
}

const getMoviesByDirector2 = async (req, reply) => {
    try {
        const data = await movie.findAll({
            attributes: ['name'],
            include: {
                model: director,
                where: {
                    name: req.params.name
                },
                attributes: ['name']
            }
        })
        reply(data)
    } catch (error) {
        reply(error.message);
    }
}

const bestReviewByMovie = async (req, reply) => {
    try {
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
        reply(data)
    } catch (error) {
        reply(error.message);
    }
}

const hitMoviesByActor = async (req, reply) => {
    try {
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
        reply(data)
    } catch (error) {
        reply(error.message);
    }
}

const worstRatedMovie2 = async (req, reply) => {
    try {
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
        reply(result)
    }
    catch (error) {
        reply(error.message);
    }
}

const worstRatedMovie = async (req, reply) => {
    try {
        const [result, metadata] = await sequelize.query('SELECT movie.name, AVG(rating.rating) from movie JOIN rating ON (movie.id = rating."movieId") GROUP BY movie.name ORDER BY AVG(rating.rating)')
        reply(result)
    } catch (error) {
        reply(error.message);
    }
}

const allMoviesByActor = async (req, reply) => {
    try {
        const data = await actor.findAll({
            include: {
                model: movie,
                required: true
            },
            where: {
                name: req.params.name
            }
        })
        reply(data);
    } catch (error) {

    }
}

const movieCast = async (req, reply) => {
    try {
        const data = await movie.findAll({
            include: {
                model: actor,
            },
            where: {
                name: req.params.name
            }

        })
        reply(data)
    } catch (error) {
        reply(error.message);
    }
}

const moviesCountByDirectorByGenre = async(req, reply) => {
    try {
        const [result, metadata] = await sequelize.query('SELECT genre.name, COUNT(movie.name) from movie JOIN director ON (movie."directorId" = director.id) JOIN movie_genre ON (movie.id = movie_genre."movieId") JOIN genre ON (movie_genre."genreId" = genre.id) WHERE movie."directorId" = ( SELECT id from director WHERE name = :name ) GROUP BY genre.name;', {
            replacements: {
                name: req.params.name
            }
        });
        reply(result)
    } catch (error) {
        reply(error.message);
    }
}

const directorFlops = async(req, reply) => {
    try {
    const [result, metadata] = await sequelize.query('SELECT director.name, COUNT(director.name) from ( select rating."movieId", avg(rating.rating) , movie.name from rating join movie on (movie.id = rating."movieId") group by rating."movieId", movie.name having avg(rating.rating) < 6 order by avg(rating.rating) ) as intermediate_table JOIN movie on(intermediate_table."movieId" = movie.id) JOIN director ON (movie."directorId" = director.id)  GROUP BY director.name ORDER BY COUNT(director.name) DESC');
    reply(result)
    } catch (error) {
        reply(error.message);
    }
}

// Movie routes
const addMovie = async (req, reply) => {
    try {
        const data = await movie.create(req.payload);
        reply('success')
    } catch (error) {
        reply(error.message);
    }
}

const addMovies = async (req, reply) => {
    try {
        console.log(req.payload);
        const data = await movie.bulkCreate(req.payload);
        reply('success')
    } catch (error) {
        reply(error.message);
    }
}

const deleteMovie = async (req, reply) => {
    try {
        const result = await movie.destroy({
            where: {
                id: req.params.id
            }
        })
        if(!result)
            reply('movie not found')
        else 
            reply('deleted')
    } catch (error) {
        reply(error.message);
    }
}

const updateMovie = async(req, reply) => {
    try {
        const data = await movie.update(
            req.payload,
        {
            where: {
                id: req.params.id
            }
        }
        )
        reply('updated')
    } catch (error) {
        reply(error.message);
    }
}

const addActor = async (req, reply) => {
    try {
        const result = await actor.create(req.payload)
        reply('added')
    } catch (error) {
        reply(error.message);
    }
}

const addDirector = async (req, reply) => {
    try {
        const result = await director.create(req.payload)
        reply('added')
    } catch (error) {
        reply(error.message);
    }
}

const addUser = async (req, reply) => {
    try {
        const result = await user.create(req.payload)
        reply('success')
    } catch (error) {
        reply(error.message);
    }
}

const addRating = async(req, reply) => {
    try {
        const data = await rating.create(req.payload);
        reply('rating added')
    } catch (error) {
        console.log(error);
        reply(error.message);
    }
}

// recent api's

const addMovieGenre = async (req, reply) => {
    try {
        const data = await movie_genre.create(req.payload);
        reply('added')
    } catch (error) {
        reply(error.message)
    }
}

const addMovieActor = async (req, reply) => {
    try {
        const data = await movie_actor.create(req.payload);
        reply('added')
    } catch (error) {
        reply(error.message)
    }
}

const deleteActor = async (req, reply) => {
    try {
        const data = await actor.findOne({
            where: {
                id: req.params.id
            }
        })
        if(data) {
            actor.destroy({
                where: {
                    id: req.params.id
                }
            })
            reply('deleted')
        }
        else 
            reply('no actor found')
    } catch (error) {
        reply(error.message)
    }
}

const deleteRating = async (req, reply) => {
    try {
        const result = await rating.destroy({
            where: {
                id: req.params.id
            }
        })
        if(result) {
            reply("deleted")
        }
        else {
            reply('not record found')
        }
    } catch (error) {
        reply(error.message)
    }
}

const updateRating = async (req, reply) => {
    try {
        const data = await rating.update(req.payload, {
            where: {
                id: req.params.id
            }
        })
        reply('updated')
    } catch (error) {
        reply(error.message)
    }
}

module.exports = {getAllMovies, getCountByGenre, sample, q10, getMoviesByDirector2, getMoviesByGenre, bestReviewByMovie, addRating, addActor, addDirector, addMovie, addMovies, getMoviesByGenre2, hitMoviesByActor, worstRatedMovie2, allMoviesByActor, movieCast, moviesCountByDirectorByGenre, directorFlops, deleteMovie, updateMovie, addUser, addMovieGenre, addMovieActor, deleteActor, deleteRating, updateRating}