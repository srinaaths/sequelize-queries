const {getAllMovies, getCountByGenre, sample, q10, getMoviesByDirector2, getMoviesByGenre, bestReviewByMovie, addRating, addActor, addDirector, addMovie, addMovies, getMoviesByGenre2, hitMoviesByActor, worstRatedMovie2, allMoviesByActor, movieCast, moviesCountByDirectorByGenre, directorFlops, deleteMovie, updateMovie, addUser, addMovieGenre, addMovieActor} = require('../controllers/controllers.js')

module.exports = [{
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
}, {
    method: 'GET',
    path: '/worstRatedMovie',
    // handler: worstRatedMovie
    handler: worstRatedMovie2
}, {
    method: 'GET',
    path: '/allMoviesByActor/{name}',
    handler: allMoviesByActor
}, {
    method: 'GET',
    path: '/movieCast/{name}',
    handler: movieCast
}, {
    method: 'GET',
    path: '/moviesCountByDirectorByGenre/{name}',
    handler: moviesCountByDirectorByGenre
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
    handler: deleteMovie
}, {
    method: 'PUT',
    path: '/updatemovie/{id}',
    handler: updateMovie
}, {
    method: 'POST',
    path: '/addactor',
    handler: addActor
}, {
    method: 'POST',
    path: '/adddirector',
    handler: addDirector
},
{
    method: 'GET',
    path: '/updatemovie/{id}',
    handler: updateMovie
}, {
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
}
]