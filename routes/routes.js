const { getAllMovies, getCountByGenre, sample, q10, getMoviesByDirector2, getMoviesByGenre, bestReviewByMovie, addRating, addActor, addDirector, addMovie, addMovies, getMoviesByGenre2, hitMoviesByActor, worstRatedMovie2, allMoviesByActor, movieCast, moviesCountByDirectorByGenre, directorFlops, deleteMovie, updateMovie, addMovieGenre, addMovieActor, deleteActor, deleteRating, updateRating, getAllMoviesCached, getMovieById, getAllMoviesByPages, loginUser, isUserAuthenticated ,getAllDirectors, bestRatedMovie} = require('../controllers/controllers.js')
const {addUser} = require('../controllers/UserRoute.js')
const { idValidator, nameValidator } = require('../validation.js')
const pagination = require('hapi-pagination')

const server = require('../index.js')

const logger = require('../logger/logger.js')

    module.exports = [{
        method: 'GET',
        path: '/',
        // handler: getAllMovies,
        config: {
            cors: true,
            plugins: {
                pagination: {
                    enabled: true,
                    defaults: {
                        limit: 5,
                        page:1,
                        offset: 10
                    }
                }
            }
        },
        handler: getAllMoviesCached,
    }, {
        method: 'GET',
        path: '/movies',
        handler: getAllMoviesByPages
    },
    {
        method: 'GET',
        path: '/directors',
        handler: getAllDirectors
    },
    {
        method: 'GET',
        path: '/{id}',
        // handler: getAllMovies,
        handler: getMovieById,
    },
    {
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
        config: {
            handler: q10,
            validate: {
                params: nameValidator
            }
        }
    }, {
        method: 'GET',
        path: '/getMoviesByDirector/{name}',
        config: {
            cors: true,
            handler: getMoviesByDirector2,
            validate: {
                params: nameValidator
            },
        }
    }, {
        method: 'GET',
        path: '/getMoviesByGenre/{name}',
        config: {
            handler: getMoviesByGenre2,
            validate: {
                params: nameValidator
            },
            cors: {
                origin: ['*'],
            }
        }
    }, {
        method: 'GET',
        path: '/bestReviewByMovie/{name}',
        config: {
            handler: bestReviewByMovie,
            validate: {
                params: nameValidator
            }
        }
    }, {
        method: 'GET',
        path: '/hitMoviesByActor/{name}',
        config: {
            handler: hitMoviesByActor,
            validate: {
                params: nameValidator
            }
        }
    }, {
        method: 'GET',
        path: '/worstRatedMovie',
        // handler: worstRatedMovie
        handler: worstRatedMovie2,
    }, {
        method: 'GET',
        path: '/bestRatedMovie',
        // handler: worstRatedMovie
        handler: bestRatedMovie,
    }, {
        method: 'GET',
        path: '/allMoviesByActor/{name}',
        config: {
            handler: allMoviesByActor,
            validate: {
                params: nameValidator
            }
        }
    }, {
        method: 'GET',
        path: '/movieCast/{name}',
        config: {
            handler: movieCast,
            validate: {
                params: nameValidator
            }
        }

    }, {
        method: 'GET',
        path: '/moviesCountByDirectorByGenre/{name}',
        config: {
            handler: moviesCountByDirectorByGenre,
            validate: {
                params: nameValidator
            }
        }
    },
    {
        method: 'GET',
        path: '/directorFlops',
        handler: directorFlops
    }, {
        method: 'POST',
        path: '/addmovie',
        handler: addMovie
    }, {
        method: 'POST',
        path: '/addmovies',
        handler: addMovies
    },
    {
        method: 'DELETE',
        path: '/deletemovie/{id}',
        config: {
            handler: deleteMovie,
            validate: {
                params: idValidator
            }
        }
    }, {
        method: 'PUT',
        path: '/updatemovie/{id}',
        config: {
            handler: updateMovie,
            validate: {
                params: idValidator
            }
        }
    }, {
        method: 'POST',
        path: '/addactor',
        handler: addActor
    }, {
        method: 'POST',
        path: '/adddirector',
        handler: addDirector
    },
    // {
    //     method: 'PUT',
    //     path: '/updatemovie/{id}',
    //     handler: updateMovie
    // },
    {
        method: 'POST',
        path: '/adduser',
        handler: addUser,
        config: {
            cors: true
        }
    },
    {
        method: 'POST',
        path: '/loginuser',
        handler: loginUser,
        config: {
            cors: true
        }
    },
    {
        method: 'GET',
        path: '/isuserauth',
        handler: isUserAuthenticated,
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['x-access-token']
            }
        }
    },
    {
        method: 'POST',
        path: '/addrating',
        handler: addRating
    },
    {
        method: 'POST',
        path: '/addmoviegenre',
        handler: addMovieGenre
    },
    {
        method: 'POST',
        path: '/addmovieactor',
        handler: addMovieActor
    },
    {
        method: 'DELETE',
        path: '/deleteactor/{id}',
        config: {
            handler: deleteActor,
            validate: {
                params: idValidator
            }
        }
    }, {
        method: 'DELETE',
        path: '/deleterating/{id}',
        config: {
            handler: deleteRating,
            validate: {
                params: idValidator
            }
        }
    }, {
        method: 'PUT',
        path: '/updaterating/{id}',
        config: {
            handler: updateRating,
            validate: {
                params: idValidator
            }
        }
    }
]
// })