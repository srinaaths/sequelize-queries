const { deleteMovieEs, getMoviesEs, searchMovieEs, getAllMovies, getCountByGenre, sample, q10, getMoviesByDirector2, getMoviesByGenre, bestReviewByMovie, addRating, addActor, addDirector, addMovie, addMovies, getMoviesByGenre2, hitMoviesByActor, worstRatedMovie2, allMoviesByActor, movieCast, moviesCountByDirectorByGenre, directorFlops, deleteMovie, updateMovie, addMovieGenre, addMovieActor, deleteActor, deleteRating, updateRating, getAllMoviesCached, getMovieById, getAllMoviesByPages, loginUser, isUserAuthenticated, getAllDirectors, bestRatedMovie, createMovieEs } = require('../controllers/controllers.js')
const { addUser } = require('../controllers/UserRoute.js')
const { idValidator, nameValidator } = require('../validation.js')
const pagination = require('hapi-pagination')

const server = require('../index.js')

const logger = require('../logger/logger.js')

module.exports = [
{
    method: 'GET',
    path: '/directors',
    handler: getAllDirectors
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
    path: '/hitMoviesByActor/{name}',
    config: {
        handler: hitMoviesByActor,
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
}, ]
// })