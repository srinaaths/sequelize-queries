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
