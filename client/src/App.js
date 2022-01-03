import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { Layout, Typography, Space } from 'antd'
import { HomePage, Navbar } from './components'
import './App.css'
import CryptoList from './components/CryptoList'
import CryptoApi from './components/CryptoApi'
import CryptoMarketApi from './components/CryptoMarketApi'

const App = () => (
  <div className="app">
    <div className="navbar">
      <Navbar />
    </div>
    <div className="main">
      <Layout>
        <div className="routes">
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/crypto.com">
              <CryptoList />
            </Route>
            <Route exact path="/api">
              <CryptoApi />
            </Route>
          </Switch>
        </div>
      </Layout>

      <div className="footer">
        <Typography.Title
          level={5}
          style={{ color: 'white', textAlign: 'center' }}
        >
          Copyright © 2021
          <Link to="/">Cryptoverse Inc.</Link> <br />
          All Rights Reserved.
        </Typography.Title>
        <Space>
          <Link to="/">Home</Link>
        </Space>
      </div>
    </div>
  </div>
)

export default App
