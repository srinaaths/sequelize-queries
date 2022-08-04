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
