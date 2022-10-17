const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const axios = require('axios')
const { Map_Field } = require('../../../models/map_field')

// Middleware for creating a map field
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/admin/premisions?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        await createField(req.body)
        return res.status(200).send({ status: 'EFFECT CREATED', code: 200, token: user.data.token })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Save map field with following arguments
 * @param {object} pack to save 
 */
async function createField(mapField) {
    var newField = new Map_Field(_.pick({
        name: mapField.name,
        description: mapField.description,
        readyToUse: false
    }, ['name', 'description', 'readyToUse']))
    await newField.save()
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothing if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        name: Joi.string().min(1).required(),
        description: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router