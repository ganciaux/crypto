const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const coinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cryptoComId: {
      type: String,
      trim: true,
      required: true,
    },
    coinGeckoId: {
      type: String,
      trim: true,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    isWallet: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const CoinModel = mongoose.model('Coin', coinSchema)

module.exports = CoinModel
