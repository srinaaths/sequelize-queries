const {getAllMovies, getCountByGenre, sample, q10, getMoviesByDirector2, getMoviesByGenre, bestReviewByMovie, addRating, addActor, addDirector, addMovie, addMovies, getMoviesByGenre2, hitMoviesByActor, worstRatedMovie2, allMoviesByActor, movieCast, moviesCountByDirectorByGenre, directorFlops, deleteMovie, updateMovie, addUser, addMovieGenre, addMovieActor, deleteActor, deleteRating, updateRating} = require('../controllers/controllers.js')
const {idValidator, nameValidator} = require('../validation.js')

const logger = require('../logger/logger.js')

// const Joi = require('@hapi/joi')

module.exports = [{
    method: 'GET',
    path: '/',
    handler: getAllMovies,
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
        handler: getMoviesByDirector2,
        validate: {
            params: nameValidator
        }
    }
}, {
    method: 'GET',
    path: '/getMoviesByGenre/{name}',
    config: {
        handler: getMoviesByGenre2,
        validate: {
            params: nameValidator
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
    config: {
        handler: worstRatedMovie2,
        validate: {
            params: nameValidator
        }
    }
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
    handler: addUser
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