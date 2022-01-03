import React, { useState } from 'react'
import millify from 'millify'
import { Col, Select } from 'antd'
import moment from 'moment'
import { useGetCryptoMarketChartRangeQuery } from '../services/cryptoApiGecko'

import Loader from './Loader'
import LineChart from './LineChart'
import { cryptoFiatGet } from '../services/cryptoFiat'

const { Option } = Select

const CryptoMarket = ({ crypto, isEuro }) => {
  const [timeperiod, setTimeperiod] = useState(7 * 24 * 3600)
  const { data: coinHistoryRange, isFetching } =
    useGetCryptoMarketChartRangeQuery({
      id: crypto.id,
      currency: cryptoFiatGet(isEuro, 'vs_currency'),
      from: moment().unix() - timeperiod,
      to: moment().unix(),
    })

  console.log('cyptomarket: render', timeperiod, isFetching)

  if (isFetching) return <Loader />

  const time = [
    { label: '3h', value: 3 * 3600 },
    { label: '24h', value: 24 * 3600 },
    { label: '7d', value: 7 * 24 * 3600 },
    { label: '30d', value: 30 * 24 * 3600 },
    { label: '3m', value: 3 * 30 * 24 * 3600 },
    { label: '1y', value: 365 * 24 * 3600 },
    { label: '3y', value: 3 * 365 * 24 * 3600 },
    { label: '5y', value: 5 * 365 * 24 * 3600 },
  ]

  function handleTimePeriod(value) {
    console.log('handleTimePeriod', value)
    setTimeperiod(value)
  }

  return (
    <Col className="coin-detail-container">
      <Select
        defaultValue={7 * 24 * 3600}
        className="select-timeperiod"
        placeholder="Select Timeperiod"
        onChange={handleTimePeriod}
      >
        {time.map((date) => (
          <Option value={date.value}>{date.label}</Option>
        ))}
      </Select>
      <LineChart
        coinHistory={coinHistoryRange}
        currentPrice={millify(crypto.current_price)}
        coinName={crypto.name}
        isEuro={isEuro}
      />
    </Col>
  )
}

export default CryptoMarket
