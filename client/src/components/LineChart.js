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

const LineChart = ({ coinHistory, currentPrice, coinName, isEuro }) => {
  const symbol = isEuro === undefined ? '???' : cryptoFiatGet(isEuro, 'symbol')
  const label = isEuro === undefined ? '???' : cryptoFiatGet(isEuro, 'label')

  console.log('LineChart: render', coinHistory)

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
    ],
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
