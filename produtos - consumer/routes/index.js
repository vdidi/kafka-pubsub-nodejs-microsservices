const express = require('express')
const router = express.Router()

//rota principal
router.get('/', (req, res) => {
    res.send('API is working')
})

//carregando todas as pastas aqui
require('./produto')(router)

module.exports = router