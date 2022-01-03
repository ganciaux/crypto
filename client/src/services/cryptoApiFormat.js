export const CRYPTO_API_FORMAT_GECKO = "gecko";
export const CRYPTO_API_FORMAT_COINAPI = "coinapi";

const cryptoApiFormatInit = () => {
  return {
    id: "",
    symbol: "",
    name: "",
    image: "",
    current_price: 0,
    purchase_price: 0,
    waiting_price_sell: 0,
    waiting_price_buy: 0,
    market_cap: 0,
    market_cap_rank:0,
    total_volume: 0,
    circulating_supply: 0,
    total_supply: 0,
    daily_change: 0,
    ath: 0,
    coins: 0,
    total: 0,
    total_current:0,
    profit: 0,
    operations:[],
    link:"",
    comment:""
  };
};

export const cryptoApiFormat = (dataApi, api) => {
  const data = cryptoApiFormatInit();
  switch (api) {
    case "gecko":
      return {
        ...data,
        id: dataApi.id,
        symbol: dataApi.symbol,
        name: dataApi.name,
        image: dataApi.image,
        current_price: dataApi.current_price,
        market_cap: dataApi.market_cap,
        total_volume: dataApi.total_volume,
        circulating_supply: dataApi.circulating_supply,
        total_supply: dataApi.total_supply,
        daily_change: dataApi.daily_change,
        ath: dataApi.ath,
        market_cap_rank: dataApi.market_cap_rank
      };
    default:
      break;
  }
  return data;
};
