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
  const [loading, setLoading] = useState(true) // 로딩 상태 추가

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

        // "두구두구" 타임을 위해 3초 딜레이 추가
        setTimeout(() => {
          setLoading(false) // 로딩 종료
          setShowResult(true)
        }, 3000)
      } catch (error) {
        console.error('Error fetching gacha result:', error)
        alert('가차 결과를 불러오는데 실패했습니다.')
        setLoading(false) // 에러 시 로딩 종료
      }
    }

    fetchGachaResult()
  }, [])

  return (
    <>
      <Header />
      <div id="backImg" />
      <div className="gacha-result-container">
        <div className="gacha-result-header">
          <h2 className="gacha-result-title">가차 결과</h2>
          <span className="gacha-result-close" onClick={() => navigate('/')}>
            X
          </span>
        </div>
        <div className="gacha-result-main">
          <div className="gacha-result-option">
            {loading ? (
              <div className="loader"></div> // 로더 애니메이션이 박스 안에서 표시됩니다.
            ) : (
              showResult && (
                <>
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
                  </div>
                  <button
                    className="nes-btn gacha-result-btn"
                    onClick={() => navigate('/shop')}
                  >
                    확인
                  </button>
                </>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GachaResult
