import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Button, Card, Col, Input, Modal, Row, Select, Tooltip } from 'antd'
import CryptoCardTitle from './CryptoCardTitle'
import CryptoMarketApi from './CryptoMarketApi'
import {
  LineChartOutlined,
  FallOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'

const coinGecko = axios.create({
  baseURL: 'http://localhost:4000/api',
})

const CryptoApi = () => {
  const { Option } = Select
  const [coins, setCoins] = useState([])
  const [coinsFiltered, setCoinsFiltered] = useState([])
  const [headers, setHeaders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortingBy, setSortingBy] = useState('current')
  const [isWallet, setIsWallet] = useState('all')
  const [isAlert, setIsAlert] = useState('all')
  const [isDiscount, setIsDiscount] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [coin, setCoin] = useState({})
  const [currency, setCurrency] = useState('$')
  const [currentExchange, setCurrentExchange] = useState(0.88374)

  const handleSortingBy = (value) => {
    setSortingBy(value)
  }

  const handleIsWallet = (value) => {
    setIsWallet(value)
  }

  const handleIsAlert = (value) => {
    setIsAlert(value)
  }

  const handleIsDiscount = (value) => {
    setIsDiscount(value)
  }

  const showModal = (coin) => {
    setIsModalVisible(true)
    setCoin(coin)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  function compare(a, b) {
    if (sortingBy === 'name') {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    } else if (sortingBy === 'profit') {
      return b.market.profit - a.market.profit
    } else if (sortingBy === 'rank') {
      return a.market.market_cap_rank - b.market.market_cap_rank
    } else if (sortingBy === 'current') {
      return b.total_current - a.total_current
    } else if (sortingBy === 'alert_max') {
      return a.market.current_price_to_alert - b.market.current_price_to_alert
    } else if (sortingBy === 'ath') {
      return b.market.current_price_to_ath - a.market.current_price_to_ath
    } else if (sortingBy === 'line50') {
      return b.market.current_price_to_line50 - a.market.current_price_to_line50
    }
  }

  useEffect(() => {
    console.log('useEffect')
    const fetchData = async () => {
      setIsLoading(true)
      //const response = await coinGecko.get('/coins/mock')
      const response = await coinGecko.get('/coins/new/usd')

      var options = {
        method: 'GET',
        url: 'https://currency-exchange.p.rapidapi.com/exchange',
        params: { from: 'USD', to: 'EUR', q: '1.0' },
        headers: {
          'x-rapidapi-host': 'currency-exchange.p.rapidapi.com',
          'x-rapidapi-key':
            '7ce4dbab36mshdd18c65adaaf6aap19c22ajsn1a50b8beab17',
        },
      }
      const exchange = await axios.request(options)
      setCurrentExchange(exchange.data)

      setCoins(response.data.coins)
      setHeaders({
        total_purchases: response.data.headers.total_purchases.toFixed(2),
        total_profit: response.data.headers.total_profit.toFixed(2),
      })
      setIsLoading(false)
    }
    fetchData()
    console.log(coins)
  }, [])

  useEffect(() => {
    const filteredData = coins?.filter(
      (item) =>
        (item.name.toLowerCase().includes(searchTerm) ||
          item.symbol.toLowerCase().includes(searchTerm)) &&
        (isWallet === 'all' ||
          (item.isWallet === true && isWallet === 'yes') ||
          (item.isWallet === false && isWallet === 'no')) &&
        (isAlert === 'all' ||
          (item.market.isAlert === true && isAlert === 'yes') ||
          (item.market.isAlert === false && isAlert === 'no')) &&
        (isDiscount === 'all' ||
          (item.market.isDiscount === true && isDiscount === 'yes') ||
          (item.market.isDiscount === false && isDiscount === 'no')),
    )

    filteredData?.sort(compare)

    setCoinsFiltered(filteredData)
  }, [coins, searchTerm, sortingBy, isWallet, isAlert, isDiscount])

  const renderCoins = () => {
    if (isLoading) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <h4>Purchases: {headers.total_purchases}</h4>
        <h4>Profit: {headers.total_profit}</h4>
        <h4>Coins: {coinsFiltered?.length}</h4>
        <h4>Change: 1$ = {currentExchange}€</h4>
        <p>
          <Input
            placeholder="Search Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </p>
        <p>
          <span>Sorting by: </span>
          <Select defaultValue={sortingBy} onChange={handleSortingBy}>
            <Option value="name">name</Option>
            <Option value="rank">rank</Option>
            <Option value="profit">profit</Option>
            <Option value="current">current</Option>
            <Option value="discount">discount</Option>
            <Option value="alert_max">alert(max)</Option>
            <Option value="line50">line50</Option>
            <Option value="ath">ath</Option>
          </Select>
          <span>Wallet: </span>
          <Select defaultValue={isWallet} onChange={handleIsWallet}>
            <Option value="all">all</Option>
            <Option value="yes">yes</Option>
            <Option value="no">no</Option>
          </Select>
          <span>Alert: </span>
          <Select defaultValue={isAlert} onChange={handleIsAlert}>
            <Option value="all">all</Option>
            <Option value="yes">yes</Option>
            <Option value="no">no</Option>
          </Select>
          <span>Discount: </span>
          <Select defaultValue={isDiscount} onChange={handleIsDiscount}>
            <Option value="all">all</Option>
            <Option value="yes">yes</Option>
            <Option value="no">no</Option>
          </Select>
        </p>
        <Row gutter={[32, 32]} className="crypto-card-container">
          {coinsFiltered?.map((coin) => (
            <Col xs={24} sm={12} lg={8} className="crypto-card" key={coin.id}>
              <Card
                title={
                  <CryptoCardTitle
                    rank={coin.market.market_cap_rank}
                    isWallet={coin.isWallet}
                    symbol={coin.symbol}
                    name={coin.name}
                  />
                }
                extra={
                  <img
                    alt="crypto"
                    className="crypto-image"
                    src={coin.market.image}
                  />
                }
                hoverable
              >
                <div
                  className={
                    coin.market.isDiscount
                      ? 'coin-is-discount coin-profit'
                      : 'coin-is-discount coin-loss'
                  }
                >
                  {coin.market.discountStatus}
                </div>
                <div>
                  <span className="coin-label">Coins: </span>
                  <span className="coin-value">
                    <span>
                      {coin.market.coins.toFixed(coin.market.precision)}{' '}
                      {coin.symbol}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="coin-label">Total: </span>
                  <span className="coin-value">
                    <span>
                      {(coin.market.coins * coin.market.purchases_avg).toFixed(
                        2,
                      )}
                      {currency}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="coin-label">Wallet: </span>
                  <span className="coin-value">
                    <span>
                      {coin.market.wallet.toFixed(coin.market.precision)}
                      {currency}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="coin-label">Profit: </span>
                  <span
                    className={
                      coin.market.profit >= 0 ? 'coin-profit' : 'coin-loss'
                    }
                  >
                    {coin.market.profit > 0
                      ? `+${coin.market.profit.toFixed(2)}${currency}`
                      : `${coin.market.profit.toFixed(2)}${currency}`}
                  </span>
                </div>
                <div>
                  <span className="coin-label">Purchases:</span>
                  <span className="coin-value">
                    {coin.market.purchases_avg.toFixed(coin.market.precision)}
                    {currency}{' '}
                    {coin.market.isLine50 ? (
                      <CheckCircleOutlined />
                    ) : (
                      <WarningOutlined />
                    )}
                  </span>
                </div>
                <div>
                  <span className="coin-label coin-current">Current:</span>
                  <span className="coin-value coin-current">
                    {coin.market.current_price}
                    {currency}
                  </span>
                </div>
                <div>
                  <span className="coin-label coin-current">Current:</span>
                  <span className="coin-value coin-current">
                    {(coin.market.current_price * currentExchange).toFixed(
                      coin.market.precision,
                    )}
                    €
                  </span>
                </div>
                <div>
                  <span className="coin-label coin-alert">Alert:</span>
                  <Tooltip
                    placement="bottom"
                    title={`min:${coin.alert.min} / dca:${coin.alert.dca}`}
                  >
                    <span className="coin-value coin-alert">
                      {coin.alert.max}
                      {currency}
                    </span>
                  </Tooltip>
                </div>
                <div>
                  <span className="coin-label coin-alert">Alert:</span>
                  <Tooltip
                    placement="bottom"
                    title={`min:${(coin.alert.min * currentExchange).toFixed(
                      coin.market.precision,
                    )} / dca:${(coin.alert.dca * currentExchange).toFixed(
                      coin.market.precision,
                    )}`}
                  >
                    <span className="coin-value coin-alert">
                      {(coin.alert.max * currentExchange).toFixed(
                        coin.market.precision,
                      )}
                      €
                    </span>
                  </Tooltip>
                </div>
                <div>
                  <span className="coin-label coin-line50">Line 50:</span>
                  <span className="coin-value coin-line50">
                    {coin.alert.line50}
                    {currency}
                  </span>
                </div>
                <div>
                  <span className="coin-label coin-line50">Line 50 Δ:</span>
                  <span className="coin-value coin-line50">
                    {coin.market.line50Delta.toFixed(coin.market.precision)}{' '}
                    {currency}
                  </span>
                </div>
                <div>
                  <span className="coin-label coin-ath">Ath:</span>
                  <span className="coin-value coin-ath">
                    {coin.market.ath}
                    {currency}
                  </span>
                </div>
                <div>
                  <span className="coin-label">Cur/Pur:</span>
                  <span className="coin-value">
                    {coin.market.current_price_to_purchase_avg}
                    {currency}
                  </span>
                </div>
                <div>
                  <span className="coin-label">Cur/Ath:</span>
                  <span className="coin-value">
                    {' '}
                    {coin.market.current_price_to_ath}%
                  </span>
                </div>
                <div>
                  <span className="coin-label">Cur/Alt:</span>
                  <span className="coin-value">
                    {' '}
                    {coin.market.current_price_to_alert}%
                  </span>
                </div>
                <div>
                  <span className="coin-label">Cur/Line50:</span>
                  <span className="coin-value">
                    {' '}
                    {coin.market.current_price_to_line50.toFixed(2)}X
                  </span>
                </div>
                <div>{coin.comment}</div>
                <Button
                  type="primary"
                  shape="round"
                  icon={<YoutubeOutlined />}
                  href={coin.link}
                  target="blank"
                />
                <Button
                  type="primary"
                  shape="round"
                  icon={<LineChartOutlined />}
                  onClick={() => showModal(coin)}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <div>Symbol;Coins;Purchase;Profit;Current;</div>
        {coinsFiltered?.map((coin) => (
          <div>
            {coin.symbol};{coin.market.coins};
            {(coin.market.coins * coin.market.purchases_avg).toFixed(2)};
            {coin.market.profit};{coin.market.current_price}
            <br />
          </div>
        ))}
        <Modal
          title="Crypto details"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={'85%'}
        >
          <CryptoMarketApi coin={coin} />
        </Modal>
      </div>
    )
  }

  return <div>{renderCoins()}</div>
}

export default CryptoApi
