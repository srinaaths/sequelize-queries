const { Queue, Worker } = require('bullmq')
const Worker2 = require('./Worker.js')

const queue = new Queue('mailQueue')

const addJob = async () => {
    await queue.add('firstJob', {
        'job': '1'
    })
    console.log('added')
}

addJob();