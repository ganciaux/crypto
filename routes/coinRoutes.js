const express = require('express');
const coinController = require('../controllers/coinController');
const router = express.Router();

//coin
router.get('/', coinController.getAllCoins);
/*
router.get('/:id', coinController.getCoin);
router.post('/', coinController.createCoin);
router.put('/:id', coinController.updateCoin);
router.delete('/:id', coinController.deleteCoin);
*/
module.exports = router;