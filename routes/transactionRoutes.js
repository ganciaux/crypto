const express = require('express');
const coinController = require('../controllers/transactionController');
const router = express.Router();

//transaction
router.get('/', coinController.getAllTransactions);
/*
router.get('/:id', coinController.getCoin);
router.post('/', transactionController.createCoin);
router.put('/:id', transactionController.updateCoin);
router.delete('/:id', transactionController.deleteCoin);
*/
module.exports = router;