
const getAllDirectors = async (req, reply) => {
    try {
        const res = await director.findAll();
        reply(res);
    } catch (error) {
        logger.error(error.message)
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
