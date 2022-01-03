import React from 'react'
import { BankOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const CryptoCardTitle = ({ isWallet, symbol, name, rank }) => {
  return (
    <>
      {rank} - {isWallet && <BankOutlined />}
      {!isWallet && <ExclamationCircleOutlined />} {symbol.toUpperCase()} -
      {name}
    </>
  )
}

export default CryptoCardTitle
