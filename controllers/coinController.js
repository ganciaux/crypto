const Coin = require('../models/coinModel');

exports.getAllCoins = async (req, res, next) => {
    try {
        const coins = await Coin.find();
        res.status(200).json({
            status: 'success',
            results: coins.length,
            data: coins})
        } catch(err){
            next(err);
        }    
    };

/*
exports.getCoin = factory.getOne();
exports.createCoin = factory.createOne();
exports.updateCoin = factory.updateOne();
exports.deleteCoin = factory.deleteOne();
*/

