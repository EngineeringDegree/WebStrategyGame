const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    return res.status(404).render('pages/error404')
})

module.exports = router