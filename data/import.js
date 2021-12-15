const fs = require('fs');
const db = require('../db.js');
const Coin = require('../models/coinModel');
const Transaction = require('../models/transactionModel');

const deleteData = async () => {
  try {
    await Coin.deleteMany();
    await Transaction.deleteMany();
    console.log('Data successfully deleted !');
  } catch (err) {
    console.log(err);
  }
};

const CrypoComTransactionRead = async (file) => {
    let headers = []
    let transactions=[]
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
          transactions.push({'date': cell['Timestamp (UTC)'],
          'transation_description':cell['Transaction Description'],
          'currency':cell['Currency'],
          'amount':cell['Amount'],
          'to_currency':cell['To Currency'],
          'to_amount':cell['To Amount'],
          'native_currency':cell['Native Currency'],
          'native_amount':cell['Native Amount'],
          'native_amount_usd': cell['Native Amount (in USD)'],
          'transation_kind':cell['Transaction Kind']})
        }
      }
    })

    await Transaction.insertMany(transactions);

    return transactions
  }

const importData = async () => {
  await deleteData();
  try {
    var coinBTC = new Coin({"name":"Bitcoin", "symbol":"BTC", "description":"balblab", "isWallet":true});
    await coinBTC.save();
    await CrypoComTransactionRead('/crypto_transactions_record.csv')
    /* */
    console.log('Data successfully loaded !');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
