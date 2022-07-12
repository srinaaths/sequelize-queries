const Sequelize = require('sequelize')
const { Op } = require('sequelize')
const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
    port: 3000
})

server.start(err => {
    if (err)
        throw err
    console.log('connected');
})

const sequelize = new Sequelize('seq_db', 'srinaaths', '', {
    dialect: 'postgres',
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

const movie = sequelize.define('movie', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: Sequelize.DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

const director = sequelize.define('director', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

const actor = sequelize.define('actor', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

const genre = sequelize.define('genre', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
    }
})

const movie_actor = sequelize.define('movie_actor', {
    role: {
        type: Sequelize.DataTypes.STRING
    }
})

const movie_genre = sequelize.define('movie_genre', {})

const rating = sequelize.define('rating', {
    rating: {
        type: Sequelize.DataTypes.FLOAT
    }
})
const init = () => {
    director.hasMany(movie)
    movie.belongsTo(director)

    movie.belongsToMany(actor, { through: 'movie_actor' });
    actor.belongsToMany(movie, { through: 'movie_actor' });

    movie.belongsToMany(genre, { through: 'movie_genre' })
    genre.belongsToMany(movie, { through: 'movie_genre' })

    movie.hasMany(rating);
    rating.belongsTo(movie)
}

init();

const getAllMovies = async (req, reply) => {
    try {
        const data = await movie.findAll()
        reply(data)
    } catch (error) {
        console.log(error);
    }
}

const getCountByGenre = async (req, reply) => {
    try {
        const data = await movie.findAll({
            attributes: ['movie.name', 'genre.id'],
            include: {
                model: genre,
                required: true,
                attributes: ['id'],
                through: {
                    attributes: ['genreId'],
                    group: ['genreId']
                }
            },
            group: ['movie.name', 'genre.id']
        })
        reply(data)
    } catch (error) {
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
    }
}

sequelize.sync({ alter: true })
    .then(() => {
    })
    .catch(err => console.log(err))


server.route([{
    method: 'GET',
    path: '/',
    handler: getAllMovies
}, {
    method: 'GET',
    path: '/findCountByGenre',
    handler: getCountByGenre
}, {
    method: 'GET',
    path: '/sample',
    handler: sample
}, {
    method: 'GET',
    path: '/q10/{name}',
    handler: q10
}, {
    method: 'GET',
    path: '/getMoviesByDirector/{name}',
    handler: getMoviesByDirector2
}, {
    method: 'GET',
    path: '/getMoviesByGenre/{name}',
    handler: getMoviesByGenre2
}, {
    method: 'GET',
    path: '/bestReviewByMovie/{name}',
    handler: bestReviewByMovie
}, {
    method: 'GET',
    path: '/hitMoviesByActor/{name}',
    handler: hitMoviesByActor
}])