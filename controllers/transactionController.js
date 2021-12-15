const Transaction = require('../models/transactionModel');

exports.getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.aggregate([{$group:{ _id: "$transation_kind", native_amount_usd: { $sum: "$native_amount_usd" },  native_amount: { $sum: "$native_amount" } }}]);

        res.status(200).json({
            status: 'success',
            results: transactions.length,
            data: transactions})
        } catch(err){
            next(err);
        }    
    };

exports.getTransactionByCoins = async (req, res, next) => {
    try {
        const transactions = await Transaction.aggregate([{ $group: { _id: '$currency',  total: { $sum: { $cond: [ { $gt: [ '$amount', 0 ] }, '$native_amount', '-$native_amount' ]  } } } }]);
        res.status(200).json({
            status: 'success',
            results: transactions.length,
            data: transactions})
        } catch(err){
            next(err);
        }    
    };

    exports.getTransactionByCoin = async (req, res, next) => {
        const id=req.params.id;
        console.log(id)
        try {
            const transactions = await Transaction.aggregate([{
                $match: {
                  'currency': id
                }
              },{ $group: { _id: '$currency',  total: { $sum: { $cond: [ { $gt: [ '$amount', 0 ] }, '$native_amount', '-$native_amount' ]  } } } }]);
    
            res.status(200).json({
                status: 'success',
                results: transactions.length,
                data: transactions})
            } catch(err){
                next(err);
            }    
        };


        exports.getTransactionsByCoin = async (req, res, next) => {
            const id=req.params.id;
            console.log(id)
            try {
                const transactions = await Transaction.aggregate([{
                    $match: {
                      'currency': id
                    }
                  },{ $group: { _id: '$currency',  total: { $sum: { $cond: [ { $gt: [ '$amount', 0 ] }, 0, '$native_amount' ]  } } } }]);
        
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

