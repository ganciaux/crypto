const fs = require('fs')
const db = require('../db.js')
const Coin = require('../models/coinModel')
const Transaction = require('../models/transactionModel')

const deleteData = async () => {
  try {
    await Coin.deleteMany()
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
  await Coin.insertMany(coins)
}

const CrypoComTransactionRead = async (file) => {
  let headers = []
  let transactions = []
  const data = fs.readFileSync(`${__dirname}${file}`, 'utf8')
  const lines = data.toString().split('\n')
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
          transation_description: cell['Transaction Description'],
          currency: cell['Currency'],
          amount: cell['Amount'],
          to_currency: cell['To Currency'],
          to_amount: cell['To Amount'],
          native_currency: cell['Native Currency'],
          native_amount: cell['Native Amount'],
          native_amount_usd: cell['Native Amount (in USD)'],
          transation_kind: cell['Transaction Kind'],
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
    await CrypoCoinsRead('/crypto_list.json')
    await CrypoComTransactionRead('/crypto_transactions_record.csv')
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
