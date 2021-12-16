const Coin = require('../models/coinModel')
const axios = require('axios')

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})

const getCoins = (ids) => {
  try {
    return api
      .get(`/coins/markets?vs_currency=eur&ids=${ids}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log('error:', err.response)
        return err
      })
  } catch (err) {
    console.log(err)
  }
}

exports.getAllCoins = async (req, res, next) => {
  try {
    const coins = await Coin.find()

    const ids = coins.map((coin) => coin.coinGeckoId).join(',')

    const markets = await getCoins(ids)

    return res.status(200).json({
      status: 'success',
      results: markets.length,
      data: markets,
      markets,
    })
  } catch (err) {
    next(err)
  }
}

/*
exports.getCoin = factory.getOne();
exports.createCoin = factory.createOne();
exports.updateCoin = factory.updateOne();
exports.deleteCoin = factory.deleteOne();
*/
