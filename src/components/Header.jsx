import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/userinfo/${userId}`) // 백엔드 API 경로
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user info:', error)
    return {
      userNickname: 'Unknown',
      userRuby: 0,
      userPoint: 0,
    }
  }
}

const logout = () => {
  console.log('로그아웃')
  window.location.href = '/'
}

const goToBoard = () => {
  console.log('게시판으로 이동')
}

const goToMypage = (userNum) => {
  console.log('마이페이지로 이동')
  window.location.href = `/mypage/${userNum}`
}

export const goToStore = () => {
  window.location.href = '/shop'
}

const Header = () => {
  const [userInfo, setUserInfo] = useState({
    userNickname: '',
    userRuby: 0,
    userPoint: 0,
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const data = await getUserInfo(1) // 유저 ID를 하드코딩. 실제 애플리케이션에서는 동적으로 변경
      setUserInfo({
        userNickname: data.userNickname,
        userRuby: data.userRuby,
        userPoint: data.userPoint,
      })
    }
    fetchUserInfo()
  }, [])

  return (
    <header className="header-header-container">
      <div className="header-header-content">
        <div className="header-title">Animal 주식회사</div>
        <div className="header-user-info">
          <span className="header-user-name">{userInfo.userNickname}</span>
          <div className="header-ruby-info">
            <i className="nes-icon trophy header-ruby-icon" />
            <span className="header-ruby-text">{userInfo.userRuby}</span>
          </div>
          <div className="header-points-info">
            <i className="nes-icon coin header-points-icon" />
            <span className="header-points-text">{userInfo.userPoint}</span>
          </div>
          <div className="header-buttons">
            <button className="nes-btn header-btn is-board" onClick={goToBoard}>
              게시판
            </button>
            <button
              className="nes-btn header-btn is-mypage"
              onClick={() => goToMypage(userInfo.userNickname)}
            >
              마이페이지
            </button>
            <button className="nes-btn header-btn is-store" onClick={goToStore}>
              상점
            </button>
            <button className="nes-btn header-btn is-logout" onClick={logout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
