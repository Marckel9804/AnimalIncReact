import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import axios from '../utils/axios.js'
import Modal from 'react-modal' // 모달 라이브러리

const Header = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태 추가
  const [showAlert, setShowAlert] = useState(false) // 알림창 상태 추가
  const [selectedRuby, setSelectedRuby] = useState({
    amount: null,
    price: null,
  }) // 선택한 루비와 가격을 저장
  const [userInfo, setUserInfo] = useState({
    userNickname: '',
    userRuby: 0,
    userPoint: 0,
  })

  const getUserInfo = async () => {
    try {
      const response = await axios.get('/api/user/get-profile')
      return response.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      return {
        userNickname: '',
        userRuby: 0,
        userPoint: 0,
      }
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        return
      }

      const data = await getUserInfo()

      setUserInfo({
        userNickname: data.userNickname,
        userRuby: data.userRuby,
        userPoint: data.userPoint,
      })
    }
    fetchUserInfo()
  }, [])

  const login = () => {
    navigate('/login')
  }

  const logout = async () => {
    try {
      await axios.post('/api/user/logout')
      localStorage.removeItem('accessToken')
      navigate('/login')
    } catch (error) {
      console.error('Logout Error:', error)
      alert('로그아웃에 실패했습니다.')
    }
  }

  const openModal = () => {
    setIsModalOpen(true) // 모달 열기
  }

  const closeModal = () => {
    setIsModalOpen(false) // 모달 닫기
  }

  const handleRubySelect = (rubyOption) => {
    setSelectedRuby(rubyOption) // 선택한 루비 저장
    setShowAlert(true) // 알림창 열기
  }

  const handleAlertConfirm = () => {
    setShowAlert(false) // 알림창 닫기
    navigate(
      `/payment?amount=${selectedRuby.amount}&price=${selectedRuby.price}`
    )
  }

  const handleAlertClose = () => {
    setShowAlert(false) // 알림창 닫기
  }

  const token = localStorage.getItem('accessToken')
  const isLoggedIn = !!token

  return (
    <header className="header-header-container">
      <div className="header-header-content">
        <div className="header-title" onClick={() => navigate('/')}>
          Animal 주식회사
        </div>
        <div className="header-user-info">
          <span className="header-user-name">{userInfo.userNickname}</span>
          <div className="header-ruby-info">
            <i className="nes-icon trophy header-ruby-icon" />
            <span className="header-ruby-text">
              {userInfo.userRuby}
              <button className="add-ruby-btn" onClick={openModal}>
                +
              </button>
            </span>
          </div>
          <div className="header-points-info">
            <i className="nes-icon coin header-points-icon" />
            <span className="header-points-text">{userInfo.userPoint}</span>
          </div>
          <div className="header-buttons">
            <button
              className="nes-btn header-btn is-board"
              onClick={() => navigate('/board')}
            >
              게시판
            </button>
            <button
              className="nes-btn header-btn is-mypage"
              onClick={() => navigate(`/mypage`)}
            >
              마이페이지
            </button>
            <button
              className="nes-btn header-btn is-store"
              onClick={() => navigate('/shop')}
            >
              상점
            </button>
            {isLoggedIn ? (
              <button className="nes-btn header-btn is-logout" onClick={logout}>
                로그아웃
              </button>
            ) : (
              <button className="nes-btn header-btn is-login" onClick={login}>
                로그인
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 모달 창 추가 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="루비 구매"
        className="ruby-modal"
        overlayClassName="ruby-modal-overlay"
      >
        <div className="modal-header">
          <h2 className="ruby-modal-title">루비 구매</h2>
          <button className="modal-close-btn" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="ruby-options">
          <div
            className="ruby-option"
            onClick={() => handleRubySelect({ amount: 10, price: 1100 })}
          >
            <i className="nes-icon trophy is-small"></i>
            <div className="ruby-option-info">
              <span>10 루비</span>
              <span>1,100원</span>
            </div>
          </div>
          <div
            className="ruby-option"
            onClick={() => handleRubySelect({ amount: 30, price: 3300 })}
          >
            <i className="nes-icon trophy is-small"></i>
            <div className="ruby-option-info">
              <span> 30루비</span>
              <span>3,300원</span>
            </div>
          </div>
          <div
            className="ruby-option"
            onClick={() => handleRubySelect({ amount: 50, price: 5500 })}
          >
            <i className="nes-icon trophy is-small"></i>
            <div className="ruby-option-info">
              <span>50 루비</span>
              <span>5,500원</span>
            </div>
          </div>
          <div
            className="ruby-option"
            onClick={() => handleRubySelect({ amount: 70, price: 7700 })}
          >
            <i className="nes-icon trophy is-small"></i>
            <div className="ruby-option-info">
              <span>70 루비</span>
              <span>7,700원</span>
            </div>
          </div>
          <div
            className="ruby-option"
            onClick={() => handleRubySelect({ amount: 90, price: 9900 })}
          >
            <i className="nes-icon trophy is-small"></i>
            <div className="ruby-option-info">
              <span>90 루비</span>
              <span>9,900원</span>
            </div>
          </div>
          <div
            className="ruby-option"
            onClick={() => handleRubySelect({ amount: 100, price: 99000 })}
          >
            <i className="nes-icon trophy is-small"></i>
            <div className="ruby-option-info">
              <span>100 루비</span>
              <span>11,000원</span>
            </div>
          </div>
        </div>

        {/* 알림창 컴포넌트 */}
        {showAlert && (
          <div className="rubypayment-alert-container">
            <div className="rubypayment-alert-box">
              <h3 className="rubypayment-alert-title">알림</h3>
              <p className="rubypayment-alert-message">
                루비 {selectedRuby.amount}개를 구매하시겠습니까?
              </p>
              <div className="rubypayment-alert-buttons">
                <button
                  className="nes-btn rubypayment-alert-btn"
                  onClick={handleAlertConfirm}
                >
                  확인
                </button>
                <button
                  className="nes-btn rubypayment-alert-btn"
                  onClick={handleAlertClose}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </header>
  )
}

export default Header
