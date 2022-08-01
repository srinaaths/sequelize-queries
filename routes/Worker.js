const {Worker} = require('bullmq')

const worker = new Worker('mailQueue', async job => {
	console.log(job.data)
})

worker.on('completed', job => {
	console.log(`the ${job.id} has completed`)
})
worker.on('failed', job => {
	console.log(`the ${job.id} has failed`)
})