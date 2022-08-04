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
                    page: 1,
                    offset: 10
                }
            }
        }
    },
    handler: getAllMoviesCached,
},
{
    method: 'GET',
    path: '/movies',
    handler: getAllMoviesByPages
},
{
    method: 'GET',
    path: '/{id}',
    // handler: getAllMovies,
    handler: getMovieById,
},{
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
},{
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
    path: '/worstRatedMovie',
    // handler: worstRatedMovie
    handler: worstRatedMovie2,
}, {
    method: 'GET',
    path: '/bestRatedMovie',
    // handler: worstRatedMovie
    handler: bestRatedMovie,
},  {
    method: 'GET',
    path: '/movieCast/{name}',
    config: {
        handler: movieCast,
        validate: {
            params: nameValidator
        }
    }

}, {
    method: 'POST',
    path: '/addmovie',
    handler: addMovie
}, {
    method: 'POST',
    path: '/createmovie',
    handler: createMovieEs
}, {
    method: 'GET',
    path: '/getmovieses',
    handler: getMoviesEs
}, {
    method: 'GET',
    path: '/searchmoviees/{name}',
    handler: searchMovieEs
}, {
    method: 'DELETE',
    path: '/deletemoviees/{id}',
    handler: deleteMovieEs
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