import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const cryptoGeckoHeaders = {
  'x-rapidapi-host': 'coinGecko1.p.rapidapi.com',
  'x-rapidapi-key': '7ce4dbab36mshdd18c65adaaf6aap19c22ajsn1a50b8beab17',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

const ids =
  'crypto-com-chain,casper-network,solana,waltonchain,bitcoin,elrond-erd-2,chiliz,benqi,vechain,the-sandbox,gala,stellar,decentraland,avalanche-2,enjincoin,theta-token,wax,uniswap,cardano,dogecoin,fantom,shiba-inu,holotoken,ethereum,usd-coin,cosmos,basic-attention-token,yield-guild-games,litecoin,my-neighbor-alice'

const baseUrl = 'https://api.coingecko.com/api/v3'

const createRequest = (url) => ({ url, headers: cryptoGeckoHeaders })

export const cryptoApiGecko = createApi({
  reducerPath: 'cryptoApiGecko',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: () => createRequest(`/coins/list`),
    }),
    getCryptosMarkets: builder.query({
      query: ({ vs_currency }) =>
        createRequest(`/coins/markets?vs_currency=${vs_currency}&ids=${ids}`),
    }),
    getCryptoMarketChart: builder.query({
      query: ({ id, currency, days }) =>
        createRequest(
          `/coins/${id}/market_chart/?vs_currency=${currency}&days=${days}`,
        ),
    }),
    getCryptoMarketChartRange: builder.query({
      query: ({ id, currency, from, to }) =>
        createRequest(
          `/coins/${id}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`,
        ),
    }),
  }),
})

export const {
  useGetCryptosQuery,
  useGetCryptosMarketsQuery,
  useGetCryptoMarketChartQuery,
  useGetCryptoMarketChartRangeQuery,
} = cryptoApiGecko
