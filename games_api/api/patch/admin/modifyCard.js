const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card } = require('../../../models/card')

// Middleware for patching card
router.patch('/', async (req, res) => {
    // const { error } = validate(req.body)
    // if (error) {
    //     return res.status(400).send({status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP'})
    // }

    // let user = await User.findOne({ email: req.body.email })
    // if(user){
    //     if(user.admin){
    //         if(checkIfBanned(user)){
    //             return res.status(401).send({status: 'USER IS BANNED', code: 401, action: 'LOGOUT'})
    //         }
            
    //         let card = await Card.findOne({ _id: req.body.id })
    //         if(!card){
    //             return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'GO TO CARDS'})
    //         }

    //         var check = checkToken(user.token, req.body.token)
    //         if(!check){
    //             check = await askNewToken(user.refreshToken, req.body.refreshToken, user)
    //             if(check){
    //                 const filter = {
    //                     _id: card._id
    //                 }
    //                 const update = {
    //                     name: req.body.name,
    //                     image: req.body.image,
    //                     type: req.body.type,
    //                     nation: req.body.nation,
    //                     resources: req.body.resources,
    //                     attack: req.body.attack,
    //                     defense: req.body.defense,
    //                     mobility: req.body.mobility,
    //                     effects: req.body.effects,
    //                     readyToUse: req.body.readyToUse
    //                 }
        
    //                 await Card.updateOne(filter, update)
    //                 return res.status(200).send({status: 'CARD MODIFIED', code: 200, token: check})
    //             }
    //             return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
    //         }
    //         const filter = {
    //             _id: card._id
    //         }
    //         const update = {
    //             name: req.body.name,
    //             image: req.body.image,
    //             type: req.body.type,
    //             nation: req.body.nation,
    //             resources: req.body.resources,
    //             attack: req.body.attack,
    //             defense: req.body.defense,
    //             mobility: req.body.mobility,
    //             effects: req.body.effects,
    //             readyToUse: req.body.readyToUse
    //         }

    //         await Card.updateOne(filter, update)
    //         return res.status(200).send({status: 'CARD MODIFIED', code: 200})
    //     }
    //     return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
    // }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

/**
 * Validates data sent by user to log in
 * @param {object} req contains email, token, refreshToken of user which want to edit and id and name (new one) of card to edit
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().min(1).required(),
        name: Joi.string().min(1).required(),
        image: Joi.string().required(),
        type: Joi.array().required(),
        nation: Joi.array().required(),
        resources: Joi.number().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        mobility: Joi.number().required(),
        effects: Joi.array().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router