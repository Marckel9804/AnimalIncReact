import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
<<<<<<< HEAD
import axios from '../utils/axios.js'

const getUserInfo = async () => {
  try {
    const response = await axios.get('/api/get-profile') // 백엔드 API 경로
    return response.data
  } catch (error) {
    console.error('Error fetching user info:', error)
    return {
      userNum: '',
      userRuby: 0,
      userPoint: 0,
    }
  }
}
=======
import axios from 'axios'

// Axios 인스턴스 생성 및 설정
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 API 기본 URL
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
>>>>>>> dev

const logout = () => {
  console.log('로그아웃')
  localStorage.removeItem('accessToken')
  window.location.href = '/'
}

const goToBoard = () => {
  console.log('게시판으로 이동')
}

<<<<<<< HEAD
const goToMypage = (userNum) => {
=======
const goToMypage = (userNickname) => {
>>>>>>> dev
  console.log('마이페이지로 이동')
  window.location.href = `/mypage`
}

const goToStore = () => {
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
      const token = localStorage.getItem('accessToken')

      if (!token) {
        return
      }

      const data = await getUserInfo()
<<<<<<< HEAD
=======
      console.log('Fetched user info:', data) // 로그 추가
>>>>>>> dev
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

  const token = localStorage.getItem('accessToken')
  const isLoggedIn = !!token

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
