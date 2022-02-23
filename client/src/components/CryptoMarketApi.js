import React, { useEffect, useState } from 'react'
import millify from 'millify'
import { Col, Select } from 'antd'
import Loader from './Loader'
import LineChart from './LineChart'
import { useParams } from 'react-router'
import axios from 'axios'

const { Option } = Select
const coinGecko = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})
/*
const formatData = (data) => {
  return data.map((el) => {
    return {
      t: el[0],
      y: el[1].toFixed(2),
    }
  })
}
*/
const formatData = (data) => {
  const coinPrice = []
  const coinTimestamp = []

  for (let i = 0; i < data?.length; i += 1) {
    coinPrice.push(data[i][1])
    coinTimestamp.push(new Date(data[i][0]).toLocaleDateString())
  }
  return { coinPrice, coinTimestamp }
}

const CryptoMarketApi = ({ coin }) => {
  //const { id } = useParams()
  const id = coin.coinGeckoId
  const [coinData, setCoinData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [coinHistory, setCoinHistory] = useState({})

  const [range, setRange] = useState('day')

  function handleRange(value) {
    setRange(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const [day, week, month, year, max, detail] = await Promise.all([
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '1',
          },
        }),
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '7',
          },
        }),
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '30',
          },
        }),
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '365',
          },
        }),
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: 'max',
          },
        }),
        coinGecko.get('/coins/markets/', {
          params: {
            vs_currency: 'usd',
            ids: id,
          },
        }),
      ])

      setCoinData({
        day: formatData(day.data.prices),
        week: formatData(week.data.prices),
        month: formatData(month.data.prices),
        year: formatData(year.data.prices),
        max: formatData(max.data.prices),
        detail: detail.data[0],
      })
      setIsLoading(false)
    }
    fetchData()
  }, [id])

  console.log('coinData:', coinData.day)

  useEffect(() => {
    setCoinHistory(coinData.day)
  }, [coinData])

  useEffect(() => {
    if (range === 'day') {
      setCoinHistory(coinData.day)
    } else if (range === 'week') {
      setCoinHistory(coinData.week)
    } else if (range === 'month') {
      setCoinHistory(coinData.month)
    } else if (range === 'year') {
      setCoinHistory(coinData.year)
    } else if (range === 'max') {
      setCoinHistory(coinData.max)
    }
  }, [coinData.day, coinData.week, coinData.year, coinData.max, range])
  return (
    <Col className="coin-detail-container">
      <Select defaultValue={range} onChange={handleRange}>
        <Option value="day">day</Option>
        <Option value="week">week</Option>
        <Option value="month">month</Option>
        <Option value="year">year</Option>
        <Option value="max">max</Option>
      </Select>
      <LineChart
        coinHistory={coinHistory}
        coinAlert={coin.alert}
        coinTransactions={coin.transactions}
        currentPrice={coin.market.current_price}
        coinName={coin.name}
        isEuro={false}
      />
    </Col>
  )
}

export default CryptoMarketApi
