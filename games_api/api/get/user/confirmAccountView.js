const express = require('express')
const router = express.Router()

/*
Middleware which sends address confirmed page with proper information to user and with breadcrumbs. 
This middleware verify that user owns email.
*/
router.get('/', async (req, res) => {
    var data, breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Email Confirmation'
        }
    ]
    data.text = 'test'
    // Update user
    // let user = await User.findOne({ email: req.query.email })
    // if(user){
    //     if(req.query.accessToken == user.accessToken){
    //         if(!user.confirmed){
    //             const filter = {
    //                 _id: user._id
    //             }
    //             const update = {
    //                 confirmed : true
    //             }
    //             const result = await User.updateOne(filter, update)
    //             data = {
    //                 text: 'Address confirmed'
    //             }
    //         }else{
    //             data = {
    //                 text: 'Address already confirmed'
    //             }
    //         }
    //     }else{
    //         data = {
    //             text: 'Bad token'
    //         }
    //     }
    // }else {
    //     data = {
    //         text: 'User not found'
    //     }
    // }

    return res.status(200).render('pages/confirm', { data: data, breadcrumb: breadcrumb })
})

module.exports = router