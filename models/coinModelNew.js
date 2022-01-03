const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const coinNewSchema = new mongoose.Schema(
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
    isWallet: {
      type: Boolean,
      default: false,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      trim: true,
    },
    alert: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      dca: {
        type: Number,
        required: true,
      },
      line50: {
        type: Number,
        required: true,
      },
      target: {
        type: Number,
        required: true,
      },
    },
    transactions: { type: Array, default: [] },
  },
  {
    timestamps: true,
  },
)

const CoinNewModel = mongoose.model('CoinNew', coinNewSchema)

module.exports = CoinNewModel
