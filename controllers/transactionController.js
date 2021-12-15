const Transaction = require('../models/transactionModel');

exports.getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({
            status: 'success',
            results: transactions.length,
            data: transactions})
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

