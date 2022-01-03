import React from 'react'
import moment from 'moment'
import { cryptoFiatGet } from '../services/cryptoFiat'
import CryptoData from './CryptoData'

const CryptoTransactions = ({ crypto, isEuro }) => {
  const currency = cryptoFiatGet(isEuro, 'vs_currency')
  const symbol = cryptoFiatGet(isEuro, 'symbol')

  return (
    <div>
      <h2>{crypto.name}</h2>
      <CryptoData
        label="Price (now)"
        value={crypto.current_price}
        isEuro={isEuro}
        toFixed={6}
      />
      <table className="crypto-table">
        <thead>
          <th>Timestamp (UTC)</th>
          <th>Transaction</th>
          <th>Currency</th>
          <th>Amount</th>
          <th>To Currency</th>
          <th>To Amount</th>
          <th>Native Currency</th>
          <th>EURO</th>
          <th>USD</th>
          <th>Kind</th>
        </thead>
        <tbody>
          {crypto.operations?.map((operation) => {
            return (
              <tr key={operation}>
                <td>
                  {moment(operation['Timestamp (UTC)']).format('YYYY-MM-DD')}
                </td>
                <td>{operation['Transaction Description']}</td>
                <td>{operation['Currency']}</td>
                <td>
                  {operation['Amount']}
                  {operation['Transaction Kind'] === 'crypto_purchase'
                    ? ` (${(
                        parseFloat(operation['Native Amount']) /
                        parseFloat(operation['Amount'])
                      ).toFixed(3)}€, ${(
                        parseFloat(operation['Native Amount (in USD)']) /
                        parseFloat(operation['Amount'])
                      ).toFixed(3)}$)`
                    : ''}
                </td>
                <td>{operation['To Currency']}</td>
                <td>
                  {operation['To Amount']}
                  {operation['Transaction Kind'] === 'crypto_exchange'
                    ? ` (${(
                        parseFloat(operation['Native Amount']) /
                        parseFloat(operation['To Amount'])
                      ).toFixed(3)}€, 
                      ${(
                        parseFloat(operation['Native Amount (in USD)']) /
                        parseFloat(operation['To Amount'])
                      ).toFixed(3)}$)`
                    : ''}
                </td>
                <td>{operation['Native Currency']}</td>
                <td>{operation['Native Amount']}</td>
                <td>
                  {parseFloat(operation['Native Amount (in USD)']).toFixed(2)}
                </td>
                <td>{operation['Transaction Kind']}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CryptoTransactions
