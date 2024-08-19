import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './User_main.css'
import 'nes.css/css/nes.min.css' // NES.css 스타일 임포트
import axiosInstance from '../../utils/axios.js' // 경로 수정

const User_main = () => {
  const [userInfo, setUserInfo] = useState({
    animal_image: '',
    user_tier: '',
  })
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/api/user/get-profile')
        const data = response.data

        // API에서 받은 데이터를 state에 저장
        setUserInfo({
          animal_image: data.animalImage, // selected_animal_id에 해당하는 이미지
          user_tier: data.userGrade, // userGrade를 user_tier로 매핑
        })
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchUserInfo()
  }, [])

  const goToMypage = () => {
    navigate(`/mypage`)
  }

  const goToStore = () => {
    navigate('/shop')
  }

  const goToGameStart = () => {
    navigate('/CreateRoom')
  }

  return (
    <div className="user-main nes-container with-title is-rounded">
      <div className="user-info1">
        <span className="user-tier">티어: {userInfo.user_tier}</span>
        <div className="image-background"></div>
        <img
          src={
            userInfo.animal_image || 'https://via.placeholder.com/150' // 기본 이미지 URL
          }
          alt="캐릭터 이미지"
          className="character-image"
        />
        <div className="user-buttons1">
          <button className="nes-btn header-btn mypage1" onClick={goToMypage}>
            마이페이지
          </button>
          <button
            className="nes-btn header-btn user-btn-store1"
            onClick={goToStore}
          >
            상점
          </button>
        </div>
        <div className="user-buttons2">
          <button
            className="nes-btn header-btn user-btn-gamestart"
            onClick={goToGameStart}
          >
            게임 시작
          </button>
        </div>
      </div>
    </div>
  )
}

export default User_main
