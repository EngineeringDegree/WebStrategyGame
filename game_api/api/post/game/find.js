const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const { calculateCardsStrength } = require('../../../utils/calculations/calculateCardStrength')
const { addPlayer } = require('../../../utils/matchmaking/matchmaking')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { Rating } = require('../../../models/rating')
const { Card_Nation } = require('../../../models/card_nation')

/*
This middleware sends cards according to parameters if user is admin
*/
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'LOGOUT' })
    }

    if (res.locals.user.data) {
        if (res.locals.user.data.confirmed) {
            var deck = undefined
            try {
                deck = await Deck.findOne({ _id: req.body.userDeck, deleted: false })
            } catch (e) { }
            if (deck) {
                if (deck.owner == req.body.email) {
                    var nation = undefined
                    try {
                        nation = await Card_Nation.findOne({ _id: deck.nation, readyToUse: true })
                    } catch (e) { }
                    if (!nation) {
                        return res.status(401).send({ status: 'THAT NATION IS TURNED OFF', code: 401, action: 'CHANGE DECKS LIST' })
                    }
                    var strength = 0
                    for (let i = 0; i < deck.cards.length; i++) {
                        var card = undefined
                        try {
                            card = await Card.findOne({ _id: deck.cards[i]._id, readyToUse: true })
                        } catch (e) { }
                        if (!card) {
                            return res.status(401).send({ status: 'THAT CARD IS TURNED OFF', code: 401, action: 'DISPLAY CHANGE YOUR DECK POPUP' })
                        }

                        if (!card.nation.includes(deck.nation)) {
                            return res.status(401).send({ status: 'NATION NOT FOUND IN CARD', code: 401, action: 'DISPLAY CHANGE YOUR DECK POPUP' })
                        }
                        strength += calculateCardsStrength(card, deck.cards[i].quantity)
                    }

                    if (strength != deck.strength) {
                        const filter = {
                            _id: deck._id
                        }
                        const update = {
                            strength: strength
                        }

                        try {
                            await Deck.updateOne(filter, update)
                        } catch (e) { }
                    }

                    var rating = await Rating.findOne({ owner: req.body.email, nation: deck.nation })
                    var userRating = 1500
                    if (rating) {
                        userRating = rating.rating
                    } else {
                        var newRating = new Rating(_.pick({
                            owner: req.body.email,
                            nation: deck.nation,
                            rating: 1500
                        }, ['owner', 'nation', 'rating']))
                        try {
                            await newRating.save()
                        } catch (e) {
                            return res.status(500).send({ status: 'SOMETHING WENT WRONG', code: 500, action: 'SOMETHING WENT WRONG POPUP', token: res.locals.user.data.token })
                        }
                    }
                    var success = addPlayer({
                        id: req.body.socketId,
                        userDeck: req.body.userDeck,
                        email: req.body.email,
                        strength: strength,
                        userRating: userRating,
                        pared: false
                    })

                    if (success) {
                        return res.status(200).send({ status: 'OK', code: 200, action: 'JOIN QUEUE', token: res.locals.user.data.token })
                    }

                    return res.status(500).send({ status: 'SOMETHING WENT WRONG', code: 500, action: 'SOMETHING WENT WRONG POPUP', token: res.locals.user.data.token })
                }
                return res.status(401).send({ status: 'THAT IS NOT YOUR DECK', code: 401, action: 'RELOAD PAGE' })
            }
            return res.status(404).send({ status: 'THAT DECK DOES NOT EXISTS', code: 404, action: 'RELOAD PAGE' })
        }

        return res.status(401).send({ status: 'ACCOUNT NOT CONFIRMED', code: 401, action: 'ACCOUNT NOT CONFIRMED POPUP' })
    }
    return res.status(404).send({ status: 'USER NOT FOUND', code: 400, action: 'LOGOUT' })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        socketId: Joi.string().required(),
        userDeck: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router