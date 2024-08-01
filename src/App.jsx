import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Main from './components/main/Main'
import Store from './components/store/Store'
import GachaShop from './components/store/GachaShop'
import GachaResult from './components/store/GachaResult'
import ItemShop from './components/store/ItemShop'

import 'nes.css/css/nes.min.css'
import './App.css' // App.css 파일을 임포트합니다.

const App = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative', // 배경 투명도
  }

  const contentStyle = {
    flex: 1,
  }

  return (
    <Router>
      <div style={containerStyle}>
        <Header />
        <div style={contentStyle}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/shop" element={<Store />} />
            <Route path="/shop/animal" element={<GachaShop />} />
            <Route
              path="/shop/animal-store/gacha"
              element={<GachaResult />}
            />{' '}
            {/* GachaResult 경로를 추가합니다 */}
            <Route path="/shop/item" element={<ItemShop />} />{' '}
            {/* ItemShop 경로를 추가합니다 */}
          </Routes>
        </div>
        <Footer />
        <div className="background-overlay"></div> {/* 배경 오버레이 추가 */}
      </div>
    </Router>
  )
}

export default App
