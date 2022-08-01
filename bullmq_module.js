// const {Queue, Worker} = require('bullmq')
// const { movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize } = require('./models/models.js')

// const Workers = require('./Worker.js')

// const queue = new Queue('q1')

// const addNum = (n1, n2) => n1 + n2;

// const addMovieFunc = async() => {
//     try {
//         logger.info('addMovie called')
//         const data = await movie.create({
//             "name": "helloooooooooo",
//             "directorId": 2
//         });
//         logger.info('addMovie success')
//         reply('success')
//     } catch (error) {
//         logger.error('addMovie failed')
//         reply(error.message);
//         console.log(error);
//     }
// }

// const addJobs = async() => {
//     await queue.add('job1', {"name": "hellooooo", "directorId": 2})
// }

// addJobs();