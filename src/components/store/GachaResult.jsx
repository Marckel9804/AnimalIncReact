import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import './GachaResult.css'
import Header from '../Header'
import Footer from '../Footer'

const GachaResult = () => {
  const navigate = useNavigate()
  const [showResult, setShowResult] = useState(false)
  const [animalData, setAnimalData] = useState(null)

  useEffect(() => {
    const fetchGachaResult = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/animal/gacha-result', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }) // 가차 결과 가져오기
        setAnimalData(response.data)
        setShowResult(true)
      } catch (error) {
        console.error('Error fetching gacha result:', error)
        alert('가차 결과를 불러오는데 실패했습니다.')
      }
    }

    fetchGachaResult()
  }, [])

  return (
    <>
      <Header />
      <div className="gacha-result-container">
        <div className="gacha-result-header">
          <h2 className="gacha-result-title">가차 결과</h2>
          <span className="gacha-result-close" onClick={() => navigate('/')}>
            X
          </span>
        </div>
        <div className="gacha-result-main">
          {showResult ? (
            <div className="gacha-result-option">
              <div className="gacha-result-icon-container">
                <img
                  src={animalData.animalImage || 'no_image_placeholder.png'}
                  alt={animalData.animalName}
                  className="gacha-result-animal-image"
                />
                <div className="gacha-result-info">
                  <div className="gacha-result-info-item">
                    <span>NO. {animalData.animalId}</span>
                  </div>
                  <div className="gacha-result-info-item">
                    <span>{animalData.animalName}</span>
                  </div>
                </div>
                <button
                  className="nes-btn gacha-result-btn"
                  onClick={() => navigate('/shop')}
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GachaResult
