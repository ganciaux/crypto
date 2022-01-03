const CRYPTO_CURRENCY_EURO=1;
const CRYPTO_CURRENCY_DOLLAR=0;
const cryptoFiat = [{symbol:'$', label:'Dollar', vs_currency:'usd'}, {symbol:'€', label:'Euro', vs_currency:'eur'}]

export const cryptoFiatGet= (isEuro, data) => {
    if (isEuro===true){
        return cryptoFiat[CRYPTO_CURRENCY_EURO][data]
    } else {
        return cryptoFiat[CRYPTO_CURRENCY_DOLLAR][data]
    }
}

