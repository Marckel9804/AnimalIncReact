import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ItemShop.css'
import itemImage from '../../assets/images/upward.jpg' // 기존 이미지로 교체
import Footer from '../Footer'
import Header from '../Header'

const ItemShop = () => {
  const navigate = useNavigate()
  const optionsRef = useRef(null)
  const [showAlert, setShowAlert] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // 임시로 10개의 아이템 데이터 생성
  const items = Array.from({ length: 10 }, (_, index) => ({
    item_name: `아이템 ${index + 1}`,
    item_description: `이 아이템 ${index + 1}은 특별한 효과를 가지고 있습니다.`,
    item_image: itemImage,
    item_price: `${index + 1} 트로피`,
    item_category: `카테고리 ${index + 1}`,
  }))

  // 왼쪽 화살표 클릭 핸들러
  const handleLeftArrowClick = () => {
    if (optionsRef.current) {
      optionsRef.current.scrollBy({ left: -240, behavior: 'smooth' }) // 가로 스크롤 위치를 직접 조작
    }
  }

  // 오른쪽 화살표 클릭 핸들러
  const handleRightArrowClick = () => {
    if (optionsRef.current) {
      optionsRef.current.scrollBy({ left: 240, behavior: 'smooth' }) // 가로 스크롤 위치를 직접 조작
    }
  }

  const handlePurchaseClick = (item) => {
    setSelectedItem(item)
    setShowAlert(true)
  }

  const handleAlertClose = () => {
    setShowAlert(false)
    setSelectedItem(null)
  }

  const handleAlertConfirm = () => {
    setShowAlert(false)
    setShowConfirm(true)
    setTimeout(() => {
      setShowConfirm(false)
      navigate('/shop/item')
    }, 2000)
  }

  return (
    <>
      <Header />
      <div className="itemshop-container">
        <div className="itemshop-header">
          <Link to="/animal/encyclopediaapi" className="itemshop-link">
            도감
          </Link>
          <h2 className="itemshop-title">아이템 상점</h2>
          <span className="itemshop-close" onClick={() => navigate('/')}>
            X
          </span>
        </div>
        <div className="itemshop-main">
          <button className="arrow-button left" onClick={handleLeftArrowClick}>
            &lt;
          </button>
          <div className="itemshop-options" ref={optionsRef}>
            {items.map((item, index) => (
              <div key={index} className="itemshop-option">
                <div className="item-header">
                  <span className="itemshop-icon-text">{item.item_name}</span>
                  <span
                    className="itemshop-item-description-icon"
                    title={item.item_description}
                  >
                    !
                  </span>
                </div>
                <img
                  src={item.item_image}
                  alt={item.item_name}
                  className="itemshop-item-image"
                />
                <div className="itemshop-info">
                  <div className="itemshop-info-item">
                    <i className="nes-icon is-small is-transparent trophy"></i>
                    <span>{item.item_price}</span>
                  </div>
                  <div className="itemshop-info-item">
                    <i className="nes-icon is-small is-transparent heart"></i>
                    <span>{item.item_category}</span>
                  </div>
                </div>
                <button
                  className="nes-btn itemshop-btn"
                  onClick={() => handlePurchaseClick(item)}
                >
                  구매하기
                </button>
              </div>
            ))}
          </div>
          <button
            className="arrow-button right"
            onClick={handleRightArrowClick}
          >
            &gt;
          </button>
        </div>
      </div>
      <div id="backImg" />
      <Footer />

      {/* 알림창 컴포넌트 */}
      {showAlert && (
        <div className="itemshop-alert-container">
          <div className="itemshop-alert-box">
            <h3 className="itemshop-alert-title">알림</h3>
            <p className="itemshop-alert-message">
              {selectedItem.item_name}을(를) {selectedItem.item_price}에
              구매하시겠습니까?
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

      {/* 결제 완료 알림창 */}
      {showConfirm && (
        <div className="itemshop-alert-container">
          <div className="itemshop-alert-box">
            <h3 className="itemshop-alert-title">결제 완료</h3>
            <p className="itemshop-alert-message">결제가 완료되었습니다.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default ItemShop
