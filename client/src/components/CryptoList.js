import React, { useEffect, useState } from 'react'
import {
  Anchor,
  Card,
  Row,
  Col,
  Input,
  Select,
  Divider,
  Modal,
  Button,
  Switch,
} from 'antd'
import Loader from './Loader'
import { HistoryOutlined, LineChartOutlined } from '@ant-design/icons'

import crypto_com_cryptos from '../data/crypto_com_cryptos.json'
import crypto_waiting_price from '../data/crypto_waiting_price.json'
import { useGetCryptosMarketsQuery } from '../services/cryptoApiGecko'
import { cryptoFiatGet } from '../services/cryptoFiat'
import { cryptoApiFormat } from '../services/cryptoApiFormat'
import CryptoData from './CryptoData'
import CryptoTransactions from './CryptoTransactions'
import CryptoMarket from './CryptoMarket'

const CryptoList = () => {
  const { Link } = Anchor;
  const { Option } = Select
  const [isEuro, setIsEuro] = useState(true)
  const [profitLoss, setProfitLoss] = useState(0.0)
  const [currency, setCurrency] = useState('')
  const [cryptoSelected, setCryptoSelected] = useState({})
  const [sortingBy, setSortingBy] = useState('current')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('transactions')
  const [cryptosDataApiFormated, setCryptosDataApiFormated] = useState([])
  const {
    data: cryptosDataApi,
    isFetching,
    isSuccess,
    refetch,
  } = useGetCryptosMarketsQuery({ vs_currency: currency })

  const handleVsCurrency = (checked, event) => {
    setIsEuro(checked)
  }

  function handleSortingBy(value) {
    setSortingBy(value)
  }

  const showModal = (current, mode) => {
    setIsModalVisible(true)
    setCryptoSelected(current)
    setModalMode(mode)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCryptoSelected({})
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
      return b.profit - a.profit
    } else if (sortingBy === 'rank') {
      return a.market_cap_rank - b.market_cap_rank
    } else if (sortingBy === 'current') {
      return b.total_current - a.total_current
    }
  }

  console.log('cyptolist: render')

  useEffect(() => {
    setCurrency(cryptoFiatGet(isEuro, 'vs_currency'))
    refetch()
    console.log('Cryptolist: useEffect: isEuro')
  }, [isEuro])

  useEffect(() => {
    let total = 0.0
    const dataApiFormated = cryptosDataApi?.map((crypto) => {
      const dataFormated = cryptoApiFormat(crypto, 'gecko')
      const coinData = crypto_com_cryptos.coins?.find((coin) => {
        return coin.symbol.toLowerCase() === dataFormated.symbol.toLowerCase()
      })
      const coinWaitingPrice = crypto_waiting_price.coins?.find((coin) => {
        return coin.symbol.toLowerCase() === dataFormated.symbol.toLowerCase()
      })
      if (coinData !== undefined) {
        dataFormated.coins = coinData.total.coins
        dataFormated.total =
          coinData.total[currency].purchases + coinData.total[currency].sales
        dataFormated.total_current =
          dataFormated.current_price * dataFormated.coins
        dataFormated.profit = dataFormated.total_current - dataFormated.total
        dataFormated.purchase_price = dataFormated.total / dataFormated.coins
        dataFormated.operations = coinData.operations
      }
      if (coinWaitingPrice !== undefined) {
        dataFormated.waiting_price_sell = coinWaitingPrice[currency].sell
        dataFormated.waiting_price_buy = coinWaitingPrice[currency].buy
        dataFormated.link = coinWaitingPrice.link
        dataFormated.comment = coinWaitingPrice.comment
      }
      if (dataFormated.profit > 0) {
        dataFormated.class = 'crypto-profit'
      } else {
        dataFormated.class = 'crypto-loss'
      }
      total += dataFormated.profit
      return dataFormated
    })

    const filteredData = dataApiFormated?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.symbol.toLowerCase().includes(searchTerm),
    )

    filteredData?.sort(compare)

    setCryptosDataApiFormated(filteredData)
    setProfitLoss(total)
    console.log('Cryptolist: useEffect')
  }, [cryptosDataApi, sortingBy, searchTerm])

  if (isFetching) return <Loader />

  return (
    <>
      <Card title="Crypto.com">
        <CryptoData
          label="Purchase"
          value={crypto_com_cryptos.total_purchase[currency]}
          isEuro={isEuro}
          toFixed={2}
        />
        <CryptoData
          label="Profit/Loss"
          value={profitLoss}
          isEuro={isEuro}
          toFixed={2}
        />
        <p>
          {cryptoFiatGet(isEuro, 'label')}:{' '}
          <Switch defaultChecked checked={isEuro} onChange={handleVsCurrency} />
        </p>
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
          </Select>
        </p>
      </Card>

      <Divider />

      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptosDataApiFormated?.map((crypto) => (
          <Col xs={24} sm={12} lg={6} className="crypto-card" key={crypto.id}>
            <Card
              className={crypto.class}
              title={`${
                crypto.market_cap_rank
              }. ${crypto.symbol.toUpperCase()} - ${crypto.name}`}
              extra={
                <img alt="crypto" className="crypto-image" src={crypto.image} />
              }
              hoverable
            >
              <CryptoData label="Coins" value={crypto.coins} />
              <CryptoData
                label="Purchase"
                value={crypto.purchase_price}
                isEuro={isEuro}
                toFixed={2}
              />
              <CryptoData
                label="Price (now)"
                value={crypto.current_price}
                isEuro={isEuro}
              />
              <CryptoData
                label="Total (purchase)"
                value={crypto.total}
                isEuro={isEuro}
                toFixed={2}
              />
              <CryptoData
                label="Total (current)"
                value={crypto.total_current}
                isEuro={isEuro}
                toFixed={2}
              />
              <CryptoData
                label="Profit/loss"
                value={crypto.profit}
                isEuro={isEuro}
                toFixed={2}
              />
              <Divider />
              <CryptoData
                label="Price (now)"
                value={crypto.current_price}
                isEuro={isEuro}
              />
              <CryptoData
                label="Price (wait sell)"
                value={crypto.waiting_price_sell}
                isEuro={isEuro}
                toFixed={2}
              />
              <CryptoData
                label="Price (wait buy)"
                value={crypto.waiting_price_buy}
                isEuro={isEuro}
                toFixed={2}
              />
              <CryptoData
                label="All Time High"
                value={crypto.ath}
                isEuro={isEuro}
              />
              <CryptoData
                label="Market cap"
                value={crypto.market_cap}
                isMillify
              />
              <CryptoData
                label="Total volume"
                value={crypto.total_volume}
                isMillify
              />
              <CryptoData
                label="Circulating supply"
                value={crypto.circulating_supply}
                isMillify
              />
              <CryptoData
                label="Total supply"
                value={crypto.total_supply}
                isMillify
              />
              
              {crypto.link.length>0 && (<a href={crypto.link} title="Link" target="blank">Link</a>)}
              <CryptoData
                label="Comment"
                value={crypto.comment}
              />
              <Button
                type="primary"
                shape="round"
                icon={<HistoryOutlined />}
                onClick={() => showModal(crypto, 'transactions')}
              />
              <Button
                type="primary"
                shape="round"
                icon={<LineChartOutlined />}
                onClick={() => showModal(crypto, 'market')}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Crypto details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'85%'}
      >
        {modalMode === 'transactions' ? (
          <CryptoTransactions
            crypto={cryptoSelected}
            isEuro={isEuro}
            currency={currency}
          />
        ) : (
          <CryptoMarket crypto={cryptoSelected} isEuro={isEuro} />
        )}
      </Modal>
    </>
  )
}

export default CryptoList
