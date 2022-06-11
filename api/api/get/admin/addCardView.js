const express = require('express')
const router = express.Router()

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: false,
            text: 'Manage',
            link: '/manage'
        },
        {
            currentPage: false,
            text: 'Cards',
            link: '/manage/card'
        },
        {
            currentPage: true,
            text: 'Add Card'
        }
    ]
    return res.status(200).render('admin/addCard', { breadcrumb: breadcrumb })
})

module.exports = router