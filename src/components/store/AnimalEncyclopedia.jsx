import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import './AnimalEncyclopedia.css'
import Header from '../Header'
import Footer from '../Footer'

const AnimalEncyclopedia = () => {
  const [animals, setAnimals] = useState([])
  const [ownedAnimals, setOwnedAnimals] = useState([])
  const [hoveredAnimal, setHoveredAnimal] = useState(null)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('/api/animal/encyclopedia')
        setAnimals(response.data)
        const ownedResponse = await axios.get('/api/user/owned-animals')
        setOwnedAnimals(ownedResponse.data)
      } catch (error) {
        console.error('Error fetching animal data:', error)
      }
    }

    fetchAnimals()
  }, [])

  const totalAnimals = animals.length
  const emptySlots = Array(50 - totalAnimals).fill({})
  const filledAnimals = [...animals, ...emptySlots]

  const handleAnimalSelect = (animal) => {
    if (ownedAnimals.includes(animal.animalId)) {
      setSelectedAnimal(animal)
      setShowConfirmation(true)
    }
  }

  const handleConfirm = async () => {
    try {
      await axios.post('/api/user/select-animal', {
        animalId: selectedAnimal.animalId,
      })
      navigate('/main', { state: { selectedAnimal: selectedAnimal } })
      setShowConfirmation(false)
    } catch (error) {
      console.error('Error selecting animal:', error)
      alert('메인 캐릭터 선택에 실패했습니다.')
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setSelectedAnimal(null)
  }

  return (
    <>
      <Header />
      <div className="encyclopedia-wrapper">
        <div className="encyclopedia-container">
          <div className="animal-list">
            {filledAnimals.map((animal, index) => (
              <div
                key={index}
                className={`animal-card ${
                  ownedAnimals.includes(animal.animalId) ? 'owned' : 'locked'
                }`}
                onMouseEnter={() => setHoveredAnimal(animal)}
                onMouseLeave={() => setHoveredAnimal(null)}
                onClick={() => handleAnimalSelect(animal)}
              >
                <div className="animal-image-container">
                  {animal.animalImage ? (
                    <img src={animal.animalImage} alt={animal.animalName} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="animal-id">No.{animal.animalId || '-'}</div>
                <div className="animal-name">
                  {animal.animalName || '빈 슬롯'}
                </div>
              </div>
            ))}
          </div>
        </div>
        {hoveredAnimal && (
          <div className="animal-alert-container show">
            <div className="animal-alert-box">
              <div className="animal-alert-title">
                {hoveredAnimal.animalName || '빈 슬롯'}
              </div>
              <div className="animal-alert-message">
                {hoveredAnimal.animalDescription || '설명 없음'}
                <br />
                확률: {hoveredAnimal.animalProbability || '미정'}
              </div>
            </div>
          </div>
        )}
        {showConfirmation && (
          <div className="confirmation-dialog">
            <div className="confirmation-dialog-box">
              <div className="confirmation-dialog-title">안내</div>
              <div className="confirmation-dialog-message">
                {selectedAnimal.animalName}을(를) 메인 캐릭터로
                선택하시겠습니까?
              </div>
              <div className="confirmation-dialog-buttons">
                <button className="nes-btn" onClick={handleConfirm}>
                  확인
                </button>
                <button className="nes-btn" onClick={handleCancel}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default AnimalEncyclopedia
