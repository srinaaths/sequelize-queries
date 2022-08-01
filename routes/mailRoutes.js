const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	host: 'localhost',
    port: 1025
})

const routes = [{
    method: 'POST',
    path: '/sendmail',
    handler: async (req, reply) => {
        const { to, sub, body } = req.payload;
        try {
            const obj = await transporter.sendMail({
                from: 'myCompany@mycompany.com',
                to: to,
                subject: sub,
                text: body
            })
            reply('success sent')
        } catch (err) {
        	console.log(err)
            reply(err.message)
        }
        // if(!obj) {
        // 	reply('no response')
        // }
        // else {
        // 	obj.then(data => console.log(data))
        // 	.catch(err => console.log(err.message))
        // 	reply('successfully sent')
        // }

    }
    // handler: (req, reply) => reply('hello')
}]

module.exports = routes