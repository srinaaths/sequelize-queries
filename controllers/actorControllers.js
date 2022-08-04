
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