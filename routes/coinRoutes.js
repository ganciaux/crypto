const express = require('express')
const coinController = require('../controllers/coinController')
const router = express.Router()

//coin
router.get('/mock', coinController.mock)
router.get('/:vs_currency', coinController.getAllCoins)
router.get('/new/:vs_currency', coinController.getAllCoinsNew)
/*
router.get('/:id', coinController.getCoin);
router.post('/', coinController.createCoin);
router.put('/:id', coinController.updateCoin);
router.delete('/:id', coinController.deleteCoin);
*/
module.exports = router
