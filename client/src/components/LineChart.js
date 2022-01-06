import React, { useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { cryptoFiatGet } from '../services/cryptoFiat'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Chart, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

const { Title } = Typography

const formatData = (data) => {
  const coinPrice = []
  const coinTimestamp = []
console.log('formatData:', data?.length)
  for (let i = 0; i < data?.length; i += 1) {
    if (data.transaction_kind==="crypto_purchase"){
      coinPrice.push(data[i]['native_amount_usd'])
      coinTimestamp.push(new Date(data[i]['date']).toLocaleDateString())
    }
    
  }
  return { coinPrice, coinTimestamp }
}

const LineChart = ({ coinHistory, coinAlert, coinTransactions, currentPrice, coinName, isEuro }) => {
  const symbol = isEuro === undefined ? '???' : cryptoFiatGet(isEuro, 'symbol')
  const label = isEuro === undefined ? '???' : cryptoFiatGet(isEuro, 'label')


  const dataAlert=coinHistory?.coinPrice.map(data => data=coinAlert.max)

  const dataTransactions=formatData(coinTransactions)
  
  console.log('dataTransactions:', dataTransactions)

  console.log('LineChart: render', coinHistory)
  console.log('coinAlert:', coinAlert)

  const data = {
    labels: coinHistory?.coinTimestamp,
    datasets: [
      {
        label: `Price In ${label}`,
        data: coinHistory?.coinPrice,
        fill: false,
        backgroundColor: '#0071bd',
        borderColor: '#0071bd',
      },
      {
        label: `Purchase`,
        data: dataTransactions?.coinPrice,
        borderWidth: 5,
        fill: false,
        backgroundColor: '#0f0',
        borderColor: '#0f0',
      },
      {
        label: `Alert`,
        data: dataAlert,
        fill: false,
        backgroundColor: '#f00',
        borderColor: '#f00',
      },
    ],
    options: {
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: true
      },
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal'}]
      }
    }
  }

  const options = {}

  return (
    <>
      <Row className="chart-header">
        <Title level={2} className="chart-title">
          {coinName} Price Chart{' '}
        </Title>
        <Col className="price-container">
          <Title level={5} className="current-price">
            Current {coinName} Price: {symbol} {currentPrice}
          </Title>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  )
}

export default LineChart
