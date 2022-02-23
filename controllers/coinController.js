const Coin = require('../models/coinModel')
const CoinNew = require('../models/coinModelNew')
const mock = require('../data/coingecko.json')

const axios = require('axios')
const fs = require('fs')

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})

const getPercent = (x, y) => {
  let result = 0
  if (y !== 0) {
    result = (x / y) * 100
  }
  return result.toFixed(2)
}

const getVariation = (x, y) => {
  let result = 0
  if (y !== 0) {
    result = ((x - y) / y) * 100
  }
  //console.log(x, y, result)
  return result.toFixed(2)
}

const getVariation2 = (x, y) => {
  let result = 0
  if (y !== 0) {
    result = ((x - y) / y) * 100
  }
  console.log(x, y, result)
  return result.toFixed(2)
}

const getPrecision = (number) => {
  const precision = ('' + number).split('.')
  if (typeof precision[1] === 'undefined') {
    return 2
  } else {
    if (precision[1].length > 2) return precision[1].length
    else return 2
  }
}

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

exports.getAllCoins = async (req, res, next) => {
  const headers = {
    total_purchases: 0.0,
    total_profit: 0.0,
  }
  const vs_currency = req.params.vs_currency.toLowerCase()
  try {
    const coins = await Coin.find()
    const ids = coins.map((coin) => coin.coinGeckoId).join(',')
    const markets = await getCoins(vs_currency, ids)
    const coins_data = coins.map((coin) => {
      const data = { ...coin.toObject() }
      const marketData = {
        ath: 0,
        image: '',
        market_cap_rank: -1,
        current_price: 0,
        diff: {
          current_price_to_ath: 0.0,
          current_price_to_purchase_avg: 0.0,
          current_price_to_alert: 0.0,
          current_price_to_line50: 0.0,
        },
        percent: {
          current_price_to_ath: 0.0,
          current_price_to_purchase_avg: 0.0,
          current_price_to_alert: 0.0,
          current_price_to_line50: 0.0,
        },
        profit: 0.0,
        isAlert: false,
        alert: 0.0,
        isDiscount: false,
        discountStatus: 'Premium',
        isLine50: false,
        precision: 2,
      }
      let found = false
      markets.forEach((market) => {
        if (market.id === coin.coinGeckoId) {
          found = true
          const precision = getPrecision(market.current_price)
          marketData.precision = precision
          marketData.ath = market.ath
          marketData.image = market.image
          marketData.market_cap_rank = market.market_cap_rank
          marketData.current_price = market.current_price
          marketData.diff.current_price_to_ath = (
            market.current_price - market.ath
          ).toFixed(precision)
          marketData.diff.current_price_to_alert = (
            market.current_price - coin.alert.max
          ).toFixed(precision)
          marketData.diff.current_price_to_line50 = (
            market.current_price - coin.alert.line50
          ).toFixed(precision)
          marketData.percent.current_price_to_ath = getVariation(
            market.current_price,
            marketData.ath,
          )
          marketData.percent.current_price_to_alert = getVariation(
            market.current_price,
            coin.alert.max,
          )
          marketData.percent.current_price_to_line50 = getVariation(
            market.current_price,
            coin.alert.line50,
          )

          if (vs_currency === 'eur') {
            headers.total_purchases += coin.eur.purchases
            marketData.profit =
              coin.total * market.current_price - coin.eur.wallet
            marketData.diff.current_price_to_purchase_avg = (
              market.current_price - coin.eur.purchases_avg
            ).toFixed(precision)
            marketData.percent.current_price_to_purchase_avg = getVariation(
              market.current_price,
              coin.eur.purchases_avg,
            )
            marketData.isLine50 = coin.eur.purchases_avg <= coin.alert.line50
          } else {
            headers.total_purchases += coin.usd.purchases
            marketData.profit =
              coin.total * market.current_price - coin.usd.wallet
            marketData.diff.current_price_to_purchase_avg = (
              market.current_price - coin.usd.purchases_avg
            ).toFixed(precision)
            marketData.percent.current_price_to_purchase_avg = getVariation(
              market.current_price,
              coin.usd.purchases_avg,
            )
            marketData.isLine50 = coin.usd.purchases_avg <= coin.alert.line50
          }
          headers.total_profit += marketData.profit

          data.eur.wallet = parseFloat(data.eur.wallet.toFixed(2))
          data.eur.purchases = parseFloat(data.eur.purchases.toFixed(2))
          data.eur.purchases_avg = parseFloat(
            data.eur.purchases_avg.toFixed(precision),
          )
          data.usd.wallet = parseFloat(data.usd.wallet.toFixed(2))
          data.usd.purchases = parseFloat(data.usd.purchases.toFixed(2))
          data.usd.purchases_avg = parseFloat(
            data.usd.purchases_avg.toFixed(precision),
          )

          /*
          if (
            marketData.current_price <= data.alert.min ||
            marketData.current_price <= data.alert.dca ||
            marketData.current_price <= data.alert.max
          ) {
            marketData.isAlert = true
          } else {
            marketData.isAlert = false
          }
          */

          if (data.alert.max > 0) marketData.isAlert = true
          marketData.profit = parseFloat(marketData.profit.toFixed(2))

          if (
            data.alert.line50 !== 0 &&
            data.alert.line50 > market.current_price
          ) {
            marketData.isDiscount = true
            marketData.discountStatus = 'Discount'
          }
        }
      })

      if (found === false) {
        console.log('not found:', data.name)
      }
      return { ...data, market: marketData }
    })

    headers.total_purchases = headers.total_purchases.toFixed(2)
    headers.total_profit = headers.total_profit.toFixed(2)

    return res.status(200).json({
      status: 'success',
      results: coins_data.length,
      headers,
      coins: coins_data,
    })
  } catch (err) {
    next(err)
  }
}

exports.getAllCoinsNew = async (req, res, next) => {
  const vs_currency = req.params.vs_currency.toLowerCase()
  const native_amount =
    vs_currency === 'usd' ? 'native_amount_usd' : 'native_amount'
  const headers = {
    total_purchases: 0.0,
    total_profit: 0.0,
    mission: 0.0,
    cashback: 0.0,
    withdrawal: 0.0,
  }
  try {
    //const coins = await CoinNew.find({ cryptoComId: 'CRO' })
    const coins = await CoinNew.find()
    const ids = coins.map((coin) => coin.coinGeckoId).join(',')
    const markets = await getCoins(vs_currency, ids)

    const coins_data = coins.map((coin) => {
      let total = 0.0
      const data = { ...coin.toObject() }
      const resume = {
        wallet: 0.0,
        coins: 0.0,
        purchases_avg: 0.0,
        purchases: 0.0,
        exchange: 0.0,
        withdrawal: 0.0,
        profit: 0.0,
        current_price: 0.0,
        current_price_to_ath: 0.0,
        current_price_to_alert: 0.0,
        current_price_to_line50: 0.0,
        current_price_to_purchase_avg: 0.0,
        precision: 2,
        ath: 0.0,
        image: 0,
        market_cap_rank: 0,
        alert: 0.0,
        discountStatus: 'Premium',
        isAlert: false,
        isDiscount: false,
        isLine50: false,
        line50Delta: 0.0,
      }

      markets.forEach((market) => {
        if (market.id === coin.coinGeckoId) {
          found = true
          const precision = getPrecision(market.current_price)
          resume.precision = precision
          resume.ath = market.ath
          resume.image = market.image
          resume.market_cap_rank = market.market_cap_rank
          resume.current_price = market.current_price
          data.transactions.forEach((transaction) => {
            if (transaction.transaction_kind === 'crypto_purchase') {
              resume.coins += transaction.amount
              total += transaction.amount
              resume.purchases += transaction[native_amount]
              headers.total_purchases += transaction[native_amount]
            } else if (transaction.transaction_kind === 'crypto_exchange') {
              if (transaction.to_currency === coin.cryptoComId) {
                resume.coins += transaction.to_amount
                total += transaction.to_amount
                resume.purchases += transaction[native_amount]
              } else {
                resume.coins += transaction.amount
                resume.exchange += transaction[native_amount]
              }
            } else if (transaction.transaction_kind === 'referral_gift') {
              resume.coins += transaction.amount
            } else if (transaction.transaction_kind === 'lockup_lock') {
            } else if (
              transaction.transaction_kind === 'supercharger_deposit' ||
              transaction.transaction_kind === 'supercharger_withdrawal'
            ) {
              resume.coins += transaction.amount
              //total += transaction.to_amount
              //resume.purchases += transaction[native_amount]
            } else if (
              transaction.transaction_kind === 'referral_card_cashback' ||
              transaction.transaction_kind === 'card_cashback_reverted'
            ) {
              resume.coins += transaction.amount
              headers.cashback += transaction[native_amount]
            } else if (
              transaction.transaction_kind ===
              'rewards_platform_deposit_credited'
            ) {
              resume.coins += transaction.amount
              headers.mission += transaction[native_amount]
            } else if (transaction.transaction_kind === 'crypto_withdrawal') {
              resume.coins += transaction.amount
              resume.withdrawal += transaction[native_amount]
              headers.withdrawal += transaction[native_amount]
            } else {
              console.log(
                coin.cryptoComId,
                transaction.transaction_kind,
                ': todo',
              )
            }
          })
          //
          switch (coin.symbol) {
            case 'WNK':
              resume.coins = total = 3701.784
              resume.purchases = 100
              resume.precision = 6
              break
            case 'PKN':
              resume.coins = total = 1872.344
              resume.purchases = 100
              resume.precision = 6
              break
            default:
              break
          }
          //
          console.log(coin.cryptoComId, resume.purchases, total)
          if (total > 0) resume.purchases_avg = resume.purchases / total
          resume.wallet = resume.coins * market.current_price
          resume.profit =
            resume.wallet +
            (resume.exchange - resume.purchases) -
            resume.withdrawal
          //
          resume.current_price_to_ath = getVariation(
            market.current_price,
            resume.ath,
          )
          resume.current_price_to_alert = getVariation(
            market.current_price,
            coin.alert.max,
          )
          /*resume.current_price_to_line50 = getVariation(
            market.current_price,
            coin.alert.line50,
          )*/
          resume.current_price_to_line50 =
            coin.alert.line50 / market.current_price
          if (coins > 0) {
            resume.current_price_to_purchase_avg = getVariation(
              market.current_price,
              resume.purchases_avg,
            )
          }
          resume.line50Delta = coin.alert.line50 - resume.current_price
          //
          resume.isLine50 = resume.purchases_avg <= coin.alert.line50
          if (data.alert.max > 0) resume.isAlert = true
          if (
            data.alert.line50 !== 0 &&
            data.alert.line50 > market.current_price
          ) {
            resume.isDiscount = true
            resume.discountStatus = 'Discount'
          }
          headers.total_profit += resume.profit
        }
      })

      return { ...data, market: resume }
    })

    return res.status(200).json({
      status: 'success',
      results: coins_data.length,
      headers,
      coins: coins_data,
    })
  } catch (err) {
    next(err)
  }
}

exports.mock = async (req, res, next) => {
  try {
    const data = fs.readFileSync(`${__dirname}/../data/mock.json`, 'utf8')
    return res.status(200).json(JSON.parse(data))
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
