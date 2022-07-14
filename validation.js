// const Joi = require('@hapi/joi')
const Joi = require('joi')

const idValidator = Joi.object({
    id: Joi.number().min(1).max(10000).required()
})

const nameValidator = Joi.object({
    name: Joi.string().regex(/^[A-Za-z0-9&]*$/).required()
})

module.exports = {idValidator, nameValidator}