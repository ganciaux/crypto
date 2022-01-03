const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    transaction_description: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    to_currency: {
      type: String,
      trim: true,
    },
    to_amount: {
      type: Number,
      trim: true,
    },
    native_currency: {
      type: String,
      trim: true,
    },
    native_amount: {
      type: Number,
      required: true,
      trim: true,
    },
    native_amount_usd: {
      type: Number,
      required: true,
      trim: true,
    },
    transaction_kind: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const TransactionModel = mongoose.model('Transaction', transactionSchema)

module.exports = TransactionModel
