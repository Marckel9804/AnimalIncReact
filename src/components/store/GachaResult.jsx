import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './GachaResult.css'
import characterImage from '../../assets/images/character.jpg' // 이미지 경로를 import

const GachaResult = () => {
  const navigate = useNavigate()
  const [showResult, setShowResult] = useState(false)
  const [animalData] = useState({
    animal_name: '오라 버니',
    animal_description: '이 동물은 경험치 추가 5% 효과를 가지고 있습니다.',
    animal_image: characterImage, // 임시 이미지 경로
    animal_catalog_number: '도감 번호',
    animal_rarity: '희귀성',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResult(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="gacha-result-container">
      <div className="gacha-result-header">
        <Link to="/animal/encyclopediaapi" className="gacha-result-link">
          도감
        </Link>
        <h2 className="gacha-result-title">가차 결과</h2>
        <span className="gacha-result-close" onClick={() => navigate('/')}>
          X
        </span>
      </div>
      <div className="gacha-result-main">
        {showResult ? (
          <div className="gacha-result-option">
            <div className="gacha-result-icon-container">
              <div className="animal-header">
                <span className="gacha-result-icon-text">
                  {animalData.animal_name}
                </span>
                <span
                  className="gacha-result-animal-description-icon"
                  title={animalData.animal_description}
                >
                  !
                </span>
              </div>
              <img
                src={animalData.animal_image}
                alt={animalData.animal_name}
                className="gacha-result-animal-image"
              />
              <div className="gacha-result-info">
                <div className="gacha-result-info-item">
                  <i className="nes-icon is-small heart"></i>
                  <span>{animalData.animal_catalog_number}</span>
                </div>
                <div className="gacha-result-info-item">
                  <i className="nes-icon is-small star"></i>
                  <span>{animalData.animal_rarity}</span>
                </div>
              </div>
              <button
                className="nes-btn gacha-result-btn"
                onClick={() => navigate('/shop/animal')}
              >
                확인
              </button>
            </div>
          </div>
        ) : (
          <div className="gacha-result-new-option">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GachaResult
