import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import axios from '../utils/axios.js'

const Header = () => {
  const navigate = useNavigate()

  const getUserInfo = async () => {
    try {
      const response = await axios.get('/api/user/get-profile')
      // Axios 인스턴스를 사용하여 요청
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

  const goToBoard = () => {
    console.log('게시판으로 이동')
    navigate('/board')
  }

  const goToMypage = (userNickname, navigate) => {
    console.log('마이페이지로 이동')
    navigate(`/mypage`)
  }

  const goToStore = (navigate) => {
    navigate('/shop')
  }
  const [userInfo, setUserInfo] = useState({
    userNickname: '',
    userRuby: 0,
    userPoint: 0,
  })

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        return
      }

      const data = await getUserInfo()
      console.log('Fetched user info:', data) // 로그 추가
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
      navigate('/')
    } catch (error) {
      console.error('Logout Error:', error)
      alert('로그아웃에 실패했습니다.')
    }
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
              onClick={() => goToMypage(userInfo.userNickname, navigate)}
            >
              마이페이지
            </button>
            <button
              className="nes-btn header-btn is-store"
              onClick={() => goToStore(navigate)}
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
    </header>
  )
}

export default Header
