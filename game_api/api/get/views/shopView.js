const express = require('express')
const router = express.Router()
const { Shop_Pack } = require('../../../models/shop_pack')

// Middleware which sends shop page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Shop'
        }
    ]

    var packs = await Shop_Pack.find({ readyToUse: true })
    return res.status(200).render('pages/shop', { breadcrumb: breadcrumb, packs: packs })
})

module.exports = router