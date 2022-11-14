const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { sendConfirmationEmail } = require('../../../utils/emails/user_emails')
const { User } = require('../../../models/user')
const { Token } = require('../../../models/token')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for changing user username
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401, action: actions.LOGOUT })
        }

        const pass = await bcrypt.compare(req.body.password, user.password)
        if (pass) {
            const alreadyExists = await changeUserEmail(user._id, req.body.newEmail)
            if (alreadyExists) {
                return res.status(409).send({ status: statuses.EMAIL_ALREADY_REGISTERED, code: 409, action: actions.EMAIL_ALREADY_TAKEN_POPUP })
            }

            const accessToken = await Token.findOne({ owner: user._id, type: process.env.ACCESS })
            if (!accessToken) {
                return res.status(406).send({ status: statuses.NO_ACCESS_TOKEN, code: 406, action: actions.NO_ACCESS_TOKEN_POPUP })
            }

            sendConfirmationEmail({ email: req.body.newEmail, accessToken: accessToken.token, authorizationAddress: req.body.authorizationAddress })
            return res.status(200).send({ status: statuses.EMAIL_CHANGED, code: 200, email: req.body.newEmail, action: actions.EMAIL_CHANGED_POPUP })
        }
        return res.status(403).send({ status: statuses.PASSWORDS_DO_NOT_MATCH, code: 403, action: actions.PASSWORDS_DO_NOT_MATCH_POPUP })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

/**
 * Changes user email to email variable value
 * @param {string} id of user to alter
 * @param {string} email new email of an user 
 * @param {string} oldEmail of an user 
 */
async function changeUserEmail(id, email) {
    const user = await User.findOne({ email: email })
    if (user) {
        return true
    }

    const filter = {
        _id: id
    }
    const update = {
        email: email,
        confirmed: false
    }

    try {
        await User.updateOne(filter, update)
    } catch (e) {
        return true
    }

    return false
}

/**
 * Validates data sent by user to change his username
 * @param {object} req object
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        newEmail: Joi.string().email().required(),
        authorizationAddress: Joi.string().required(),
        password: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router