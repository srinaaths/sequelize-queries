const winston = require('winston')

const customLogFormat = winston.format.printf(({timestamp, level, message}) => {
    return `${timestamp} ${level} ${message}`;
})

const logConfig = {
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(), customLogFormat
    ),
    transports: [
        new winston.transports.File({filename: 'log.txt', level: 'debug'})
    ]
}

const logger = winston.createLogger(logConfig);

module.exports = logger