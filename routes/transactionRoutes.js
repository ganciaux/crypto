const express = require('express')
const coinController = require('../controllers/transactionController')
const router = express.Router()

//transaction
router.get('/', coinController.getAllTransactions)
router.get('/coins', coinController.getTransactionByCoins)
router.get('/coin/:id', coinController.getTransactionsByCoin)
router.get('/coin/:id/total', coinController.getTransactionByCoin)
router.get('/test', coinController.test)

/*
router.get('/:id', coinController.getCoin);
router.post('/', transactionController.createCoin);
router.put('/:id', transactionController.updateCoin);
router.delete('/:id', transactionController.deleteCoin);
*/
module.exports = router
