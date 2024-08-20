import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ItemShop.css'
import axios from '../../utils/axios.js'
import Footer from '../Footer'
import Header from '../Header'

const ItemShop = () => {
  const navigate = useNavigate()
  const optionsRef = useRef(null)
  const [translateX, setTranslateX] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showError, setShowError] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [items, setItems] = useState([])
  const [userRuby, setUserRuby] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // 초기 루비 수를 가져오는 함수
  const fetchUserRuby = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/item/ruby', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserRuby(response.data)
    } catch (error) {
      console.error('Error fetching user ruby:', error)
    }
  }

  useEffect(() => {
    if (isMounted) {
      const fetchItems = async () => {
        try {
          const response = await axios.get('/api/item/list')
          setItems(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
          console.error('Error fetching items:', error)
          setItems([])
        }
      }

      fetchItems()
      fetchUserRuby()
    } else {
      setIsMounted(true)
    }
  }, [isMounted])

  const handleLeftArrowClick = () => {
    if (optionsRef.current) {
      setTranslateX((prev) => Math.min(prev + 240, 0))
    }
  }

  const handleRightArrowClick = () => {
    if (optionsRef.current) {
      const maxScroll = -((items.length - 1) * 260)
      setTranslateX((prev) => Math.max(prev - 240, maxScroll))
    }
  }

  const handlePurchaseClick = (item) => {
    setSelectedItem(item)
    setShowAlert(true)
  }

  const handleAlertClose = () => {
    setShowAlert(false)
    setShowError(false)
    setSelectedItem(null)
  }

  const handleAlertConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `/api/item/purchase?itemId=${selectedItem.itemId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUserRuby(response.data) // 루비 수를 업데이트

      setShowAlert(false)
      setShowConfirm(true)
      setTimeout(() => {
        setShowConfirm(false)
        navigate('/shop')
      }, 2000)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setShowAlert(false)
          setShowError(true)
        } else {
          console.error('Error purchasing item:', error)
        }
      } else {
        console.error('Error:', error)
      }
    }
  }

  return (
    <>
      <Header userRuby={userRuby} />
      <div id="backImg" />
      <div className="itemshop-container">
        <div className="itemshop-header">
          <h2 className="itemshop-title">아이템 상점</h2>
          <span className="itemshop-close" onClick={() => navigate('/')}>
            X
          </span>
        </div>
        <div className="itemshop-main">
          <button className="arrow-button left" onClick={handleLeftArrowClick}>
            &lt;
          </button>
          <div
            className="itemshop-options"
            ref={optionsRef}
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.itemId} className="itemshop-option">
                  <div className="item-header">
                    <span className="itemshop-icon-text">{item.itemName}</span>
                    <span
                      className="itemshop-item-description-icon"
                      title={item.itemDescription}
                    >
                      !
                    </span>
                  </div>
                  <img
                    src={item.itemImage || 'default-image-url'}
                    alt={item.itemName}
                    className="itemshop-item-image"
                  />
                  <div className="itemshop-info">
                    <div className="itemshop-info-item">
                      <i className="nes-icon is-small is-transparent trophy"></i>
                      <span>{item.itemPrice} 루비</span>
                    </div>
                    <div className="itemshop-info-item">
                      <i className="nes-icon is-small is-transparent heart"></i>
                      <span>{item.itemRarity}</span>
                    </div>
                  </div>
                  <button
                    className="nes-btn itemshop-btn"
                    onClick={() => handlePurchaseClick(item)}
                  >
                    구매하기
                  </button>
                </div>
              ))
            ) : (
              <p>아이템을 불러오는 중입니다...</p>
            )}
          </div>
          <button
            className="arrow-button right"
            onClick={handleRightArrowClick}
          >
            &gt;
          </button>
        </div>
      </div>
      <Footer />
      {showAlert && (
        <div className="itemshop-alert-container">
          <div className="itemshop-alert-box">
            <h3 className="itemshop-alert-title">알림</h3>
            <p className="itemshop-alert-message">
              {selectedItem.itemName} 을(를)
              <br />
              {selectedItem.itemPrice} 루비에 구매하시겠습니까?
            </p>
            <div className="itemshop-alert-buttons">
              <button
                className="nes-btn itemshop-alert-btn"
                onClick={handleAlertConfirm}
              >
                확인
              </button>
              <button
                className="nes-btn itemshop-alert-btn"
                onClick={handleAlertClose}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="itemshop-alert-container">
          <div className="itemshop-alert-box">
            <h3 className="itemshop-alert-title">결제 완료</h3>
            <p className="itemshop-alert-message">결제가 완료되었습니다.</p>
          </div>
        </div>
      )}
      {showError && (
        <div className="itemshop-alert-container">
          <div className="itemshop-alert-box">
            <h3 className="itemshop-alert-title">알림</h3>
            <p className="itemshop-alert-message">루비가 부족합니다.</p>
            <div className="itemshop-alert-buttons">
              <button
                className="nes-btn itemshop-alert-btn"
                onClick={handleAlertClose}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ItemShop
