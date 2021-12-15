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
exports.getCoin = factory.getOne(Article);
exports.createCoin = factory.createOne(Article);
exports.updateCoin = factory.updateOne(Article);
exports.deleteCoin = factory.deleteOne(Article);
*/

