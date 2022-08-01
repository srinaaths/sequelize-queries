const { Worker } = require('bullmq')
const { movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize } = require('./models/models.js')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025
})

// const worker = new Worker('q1', async job => {
//     console.log('processing job');
//     console.log(job.data);
//     console.log('processing job');
//     console.log(job.data.name);
//     console.log('processing job');
//     try {
//         console.log('in');
//         const data = await movie.create(job.data);
//         logger.info('addMovie success')
//         reply('success')
//     } catch (error) {
//         logger.error('addMovie failed')
//         reply(error.message);
//         console.log(error);
//     }
// })
const worker = new Worker('mailQueue', async job => {
    console.log('in worker');
    const mailSubject = job.data.mailSubject;
    const mailBody = job.data.mailBody;
    console.log(job.data.name);
    try {
        await transporter.sendMail({
            from: 'reg@filmovies.com',
            to: job.data.name,
            subject: mailSubject,
            text: mailBody
        })
    } catch (error) {
        console.log(error.message);
    }
})

worker.on('completed', () => console.log('job completed'))
module.exports = worker