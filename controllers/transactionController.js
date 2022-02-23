const Coin = require('../models/coinModelNew')
const Transaction = require('../models/transactionModel')

const axios = require('axios')

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})

const getCoins = (vs_currency, ids) => {
  console.log(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&ids=${ids}`)
  try {
    return api
      .get(`/coins/markets?vs_currency=${vs_currency}&ids=${ids}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log('error:', err.response)
        return mock
      })
  } catch (err) {
    console.log(err)
  }
}

const init = (coins, currency, transaction) => {
  if (currency!==''){
    let coin = coins.find(element => element.symbol===currency);
    if (coin===undefined){
      coin = {symbol:currency, transactions:[], total:0.0, purchase_total:0.0,purchase_avg:0.0, data:{} }
      coins.push(coin)
    }
    coin.transactions.push(
      {kind:transaction._id.transaction, currency: transaction._id.currency, to_currency: transaction._id.to_currency, native_amount_usd: transaction.native_amount_usd, native_amount: transaction.native_amount, amount: transaction.amount, to_amount: transaction.to_amount   }
    )    
  }
}
const proc_set=(coins, list) => {
  coins.forEach((coin) => {    
    const data = list.find((element) => {return element.cryptoComId===coin.symbol});
    if (data!==undefined){
      coin.data = { ...data.toObject() }
    }
    let purchase_total=0.0
    coin.transactions.forEach((transaction) => {
      switch(transaction.kind){
        case "card_cashback_reverted":
          break;
        case "crypto_purchase":
          if (coin.symbol===transaction.currency){
            coin.total+=transaction.amount
            purchase_total+=transaction.amount
            coin.purchase_total+=transaction.native_amount_usd
          }
          break;
        case "crypto_exchange":
          if (coin.symbol===transaction.currency){
            coin.total+=transaction.amount
          } else {
            coin.total+=transaction.to_amount
          }
          break;
        case "crypto_withdrawal":
          coin.total+=transaction.amount
          break;
        case "crypto_deposit":
          coin.total+=transaction.amount
          break;
        case "lockup_lock":
          break;
        case "referral_gift":
          coin.total+=transaction.amount
          break;
        case "referral_card_cashback":
          coin.total+=transaction.amount
          break;
        case "rewards_platform_deposit_credited":
          coin.total+=transaction.amount
          break;
        case "supercharger_deposit":
          break;
        case "supercharger_reward_to_app_credited":
          coin.total+=transaction.amount
          break;        
        case "supercharger_withdrawal":
          //coin.total-=transaction.amount
          break;
        default:
          console.log(coin.symbol, ': ', transaction.kind)
      }

      coin.purchase_avg = coin.purchase_total/purchase_total

    })
  })
}

exports.getAllTransactions = async (req, res, next) => {
  try {
    const coins=[]
    const coins_list = await Coin.find()
    const ids = coins_list.map((coin) => coin.coinGeckoId).join(',')
    const markets = await getCoins('usd', ids)
    const transactions = await Transaction.aggregate([
      {
        $group: {
          _id: {transaction:'$transaction_kind', currency:'$currency', to_currency:'$to_currency'},
          native_amount_usd: { $sum: '$native_amount_usd' },
          native_amount: { $sum: '$native_amount' },
          amount: {$sum: '$amount'},
          to_amount: {$sum: '$to_amount'}
        },
      },
      {$sort: {"_id.currency":1}}
    ])

    transactions.forEach((transaction) => {
      const currency=transaction['_id'].currency;
      const to_currency=transaction['_id'].to_currency;
      init(coins, currency, transaction)
      init(coins, to_currency, transaction)
    })

    proc_set(coins, coins_list)

    res.status(200).json({
      status: 'success',
      results: coins.length,
      data: {...coins},
    })
  } catch (err) {
    next(err)
  }
}

exports.getTransactionByCoins = async (req, res, next) => {
  try {
    const transactions = await Transaction.aggregate([
      {
        $group: {
          _id: '$currency',
          total: {
            $sum: {
              $cond: [
                { $gt: ['$amount', 0] },
                '$native_amount',
                '-$native_amount',
              ],
            },
          },
        },
      },
    ])
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: transactions,
    })
  } catch (err) {
    next(err)
  }
}

exports.getTransactionByCoin = async (req, res, next) => {
  const id = req.params.id
  console.log(id)
  try {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          currency: id,
        },
      },
      {
        $group: {
          _id: '$currency',
          native_amount: {
            $sum: {
              $cond: [
                { $gt: ['$amount', 0] },
                '$native_amount',
                { $subtract: [0, '$native_amount'] },
              ],
            },
          },
          native_amount_usd: {
            $sum: {
              $cond: [
                { $gt: ['$amount', 0] },
                '$native_amount_usd',
                { $subtract: [0, '$native_amount_usd'] },
              ],
            },
          },
        },
      },
    ])

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: transactions,
    })
  } catch (err) {
    next(err)
  }
}

exports.getTransactionsByCoin = async (req, res, next) => {
  const id = req.params.id
  console.log(id)
  try {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          currency: id,
        },
      },
      {
        $group: {
          _id: '$currency',
          total: {
            $sum: { $cond: [{ $gt: ['$amount', 0] }, 0, '$native_amount'] },
          },
        },
      },
    ])

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: transactions,
    })
  } catch (err) {
    next(err)
  }
}

exports.test = async (req, res, next) => {
  const id = req.params.id
  console.log(id)
  try {
    const transactions = await Transaction.aggregate([
      {
        $lookup: {
          from: 'coins',
          localField: 'cryptoComId',
          foreignField: 'currency',
          as: 'data',
        },
      },
    ])

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: transactions,
    })
  } catch (err) {
    next(err)
  }
}

/*
exports.getCoin = factory.getOne(Article);
exports.createCoin = factory.createOne(Article);
exports.updateCoin = factory.updateOne(Article);
exports.deleteCoin = factory.deleteOne(Article);
*/
