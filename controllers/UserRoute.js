const { movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize } = require('../models/models.js')
const { Queue, Worker } = require('bullmq')
const Workers = require('../Worker.js')
const { Op } = require('sequelize')
const logger = require('../logger/logger.js')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025
})

const jwt = require('jsonwebtoken')

const queue = new Queue('mailQueue')

const addUser = async (req, reply) => {
    try {
        logger.info('addUser called')
        const userData = req.payload;
        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPass;
        const result = await user.create(userData)
        logger.info('addUser success')
        await queue.add('email', { "name": req.payload.name, "mailSubject": "Registration successful", "mailBody": "Welcome to Filmovies. Thank you for registering with us" })
        reply('success')
    } catch (error) {
        console.log(req.payload);
        logger.error('addUser failed')
        logger.error(error.message)
        reply(error.message);
    }
}

module.exports = { addUser }