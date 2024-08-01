import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './GachaShop.css'

const GachaShop = () => {
  const navigate = useNavigate()
  const [showAlert, setShowAlert] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleGachaClick = () => {
    setShowAlert(true)
  }

  const handleAlertClose = () => {
    setShowAlert(false)
  }

  const handleAlertConfirm = () => {
    setShowAlert(false)
    setShowConfirm(true)
    setTimeout(() => {
      navigate('/shop/animal-store/gacha')
    }, 2000)
  }

  return (
    <div className="gacha-container">
      <div className="gacha-header">
        <Link to="/animal/encyclopediaapi" className="gacha-link">
          도감
        </Link>
        <h2 className="gacha-title">가차 상점</h2>
        <span className="gacha-close" onClick={() => navigate('/')}>
          X
        </span>
      </div>
      <div className="gacha-main">
        <div className="gacha-options">
          <div className="gacha-option">
            <div className="gacha-icon-container">
              <span className="gacha-icon-text">가차 뽑기</span>
              <div className="gacha-ruby-container">
                <i className="nes-icon trophy gacha-ruby-icon"></i>
                <span className="gacha-ruby-text">5</span>
              </div>
              <i className="nes-pokeball gacha-animal-icon"></i>
            </div>
            <button className="nes-btn gacha-btn" onClick={handleGachaClick}>
              뽑기
            </button>
          </div>
        </div>
      </div>

      {/* 알림창 컴포넌트 */}
      {showAlert && (
        <div className="gacha-alert-container">
          <div className="gacha-alert-box">
            <h3 className="gacha-alert-title">알림</h3>
            <p className="gacha-alert-message">루비 5개를 사용하여 뽑기</p>
            <div className="gacha-alert-buttons">
              <button
                className="nes-btn gacha-alert-btn"
                onClick={handleAlertConfirm}
              >
                확인
              </button>
              <button
                className="nes-btn gacha-alert-btn"
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
        <div className="gacha-alert-container">
          <div className="gacha-alert-box">
            <h3 className="gacha-alert-title">결제 완료</h3>
            <p className="gacha-alert-message">결제가 완료되었습니다.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GachaShop
