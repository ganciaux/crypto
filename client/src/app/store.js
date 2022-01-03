import { configureStore } from '@reduxjs/toolkit'

import { cryptoApiGecko } from '../services/cryptoApiGecko'

export default configureStore({
  reducer: {
    [cryptoApiGecko.reducerPath]: cryptoApiGecko.reducer,
  },
})
