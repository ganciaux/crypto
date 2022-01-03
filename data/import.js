const fs = require('fs')
const db = require('../db.js')
const Coin = require('../models/coinModel')
const CoinNew = require('../models/coinModelNew')

const Transaction = require('../models/transactionModel')

const formatValue = (string) => {
  const value = parseFloat(string)
  if (Number.isNaN(value) == true) return 0.0
  else return value
}

const deleteData = async () => {
  try {
    await Coin.deleteMany()
    await CoinNew.deleteMany()
    await Transaction.deleteMany()
    console.log('Data successfully deleted !')
  } catch (err) {
    console.log(err)
  }
}
const CrypoCoinsRead = async (file) => {
  const data = fs.readFileSync(`${__dirname}${file}`, 'utf8')
  const coins = JSON.parse(data).coins
  console.log('CrypoCoinsRead:', coins.length)
  const transactions = await Transaction.find()
  coins.forEach((coin) => {
    console.log(' - ', coin.name)
    coin.transactions = []
    const total = {
      total: 0.0,
      eur: { wallet: 0.0, purchases_avg: 0.0, purchases: 0.0, sales: 0.0 },
      usd: { wallet: 0.0, purchases_avg: 0.0, purchases: 0.0, sales: 0.0 },
    }
    transactions.forEach((transaction) => {
      if (
        coin.cryptoComId === transaction.currency ||
        coin.cryptoComId === transaction.to_currency
      ) {
        if (transaction['transaction_kind'] !== 'lockup_lock') {
          const amount = formatValue(transaction['amount'])
          const to_amount = formatValue(transaction['to_amount'])
          const native_amount = formatValue(transaction['native_amount'])
          const native_amount_usd = formatValue(
            transaction['native_amount_usd'],
          )
          console.log(transaction)
          if (transaction['transaction_kind'] === 'crypto_purchase') {
            total.eur.purchases += native_amount
            total.usd.purchases += native_amount_usd
            console.log(total)
          }
          if (transaction['currency'] === coin.cryptoComId) {
            total.total += amount
            if (amount < 0) {
              if (
                transaction['to_currency'].length > 0 &&
                transaction['to_currency'] !== coin.cryptoComId
              ) {
                total.eur.sales -= native_amount
                total.usd.sales -= native_amount_usd
              } else {
                total.eur.sales += native_amount
                total.usd.sales += native_amount_usd
              }
            }
            if (
              transaction['to_currency'].length > 0 &&
              transaction['to_urrency'] !== coin.cryptoComId &&
              amount < 0
            ) {
              total.eur.wallet -= native_amount
              total.usd.wallet -= native_amount_usd
            } else {
              total.eur.wallet += native_amount
              total.usd.wallet += native_amount_usd
            }
          } else if (transaction['to_currency'] === coin.cryptoComId) {
            total.total += to_amount
            total.eur.wallet += native_amount
            total.usd.wallet += native_amount_usd
          } else {
            /* */
          }
        }

        /*
        if (transaction.transaction_kind === 'crypto_purchase') {
          coin.total += transaction.amount
          coin.purchase_eur += transaction.native_amount
          coin.purchase_usd += transaction.native_amount_usd
        } else if (transaction.transaction_kind === 'crypto_exchange') {
          coin.total += transaction.to_amount
          if (coin.cryptoComId === transaction.to_currency) {
            coin.purchase_eur += transaction.native_amount
            coin.purchase_usd += transaction.native_amount_usd
          }
        }*/
        coin.transactions.push(transaction)
      }
    })
    if (total.total > 0) {
      total.eur.purchases_avg = total.eur.wallet / total.total
      total.usd.purchases_avg = total.usd.wallet / total.total
    }
    coin.total = total.total
    coin.eur = { ...total.eur }
    coin.usd = { ...total.usd }
    //console.log(total.usd)
  })

  await Coin.insertMany(coins)
  await CoinNew.insertMany(coins)
}

const CrypoComTransactionRead = async (file) => {
  let headers = []
  let transactions = []
  const data = fs.readFileSync(`${__dirname}${file}`, 'utf8')
  const lines = data.toString().split('\r\n')
  lines.forEach((line, index) => {
    if (line.length > 0) {
      const cells = line.split(',')
      if (index === 0) {
        headers = cells
      } else {
        const cell = cells.reduce(
          (acc, cur, index) => ({ ...acc, [headers[index]]: cur }),
          {},
        )

        transactions.push({
          date: cell['Timestamp (UTC)'],
          transaction_description: cell['Transaction Description'],
          currency: cell['Currency'],
          amount: cell['Amount'],
          to_currency: cell['To Currency'],
          to_amount: cell['To Amount'] === '' ? 0.0 : cell['To Amount'],
          native_currency: cell['Native Currency'],
          native_amount: cell['Native Amount'],
          native_amount_usd: cell['Native Amount (in USD)'],
          transaction_kind: cell['Transaction Kind'],
        })
      }
    }
  })

  console.log('CrypoComTransactionRead:', transactions.length)
  await Transaction.insertMany(transactions)

  return transactions
}

const importData = async () => {
  await deleteData()
  try {
    await CrypoComTransactionRead('/crypto_transactions_record.csv')
    await CrypoCoinsRead('/crypto_list.json')
    console.log('Data successfully loaded !')
  } catch (err) {
    console.log(err)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}
