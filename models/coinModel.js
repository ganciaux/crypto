const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const coinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    crytoComId:{
        type: String,
        trim: true,
    },
    coinGecko:{
        type: String,
        trim: true,
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
    },
    slug: { 
        type: String, 
        slug: "name", 
        unique: true, 
        slugPaddingSize: 3 
    },
    description: {
        type: String,
        trim: true,
    },
    isWallet: {
        type: Boolean,
        default: false
    },
}, {
  timestamps: true,
});

const CoinModel = mongoose.model('Coin', coinSchema);

module.exports = CoinModel;