const express = require('express')
const router = express.Router()
const { User } = require('../../models/user')

router.get('/', async (req, res) => {
    var data
    let user = await User.findOne({ 'email': { $regex : new RegExp(req.query.email, 'i') } })
    if(user){
        if(req.query.accessToken == user.accessToken){
            if(!user.confirmed){
                const filter = {
                    _id: user._id
                }
                const update = {
                    confirmed : true
                }
                const result = await User.updateOne(filter, update)
                data = {
                    text: 'Address confirmed'
                }
            }else{
                data = {
                    text: 'Address already confirmed'
                }
            }
        }else{
            data = {
                text: 'Bad token'
            }
        }
    }else {
        data = {
            text: 'User not found'
        }
    }

    return res.status(200).render('pages/confirm', data)
})

module.exports = router