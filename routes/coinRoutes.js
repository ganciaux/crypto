const express = require('express');
const coinController = require('../controllers/coinController');
const router = express.Router();

//article
router.get('/', coinController.getAllCoins);
/*
router.get('/:id', coinController.getCoin);
router.post('/', articleController.createCoin);
router.put('/:id', articleController.updateCoin);
router.delete('/:id', articleController.deleteCoin);
*/
module.exports = router;