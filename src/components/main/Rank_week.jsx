import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Rank_week.css'
import 'nes.css/css/nes.min.css' // NES.css 스타일 임포트
import axiosInstance from '../../utils/axios.js' // axios 경로

// Rank_week 컴포넌트 정의
const Rank_week = () => {
  const [rankingData, setRankingData] = useState([])
  const navigate = useNavigate()

  // 컴포넌트가 마운트될 때 한 번 실행되는 useEffect 훅
  useEffect(() => {
    // 비동기 함수로 API에서 랭킹 데이터를 가져오는 함수 정의
    const fetchRankingData = async () => {
      try {
        const response = await axiosInstance.get('/api/user/rankings') // 전체 랭킹 데이터를 가져오는 API 호출
        const data = response.data
        if (Array.isArray(data)) {
          const sortedData = data.sort((a, b) => b.userPoint - a.userPoint) // userPoint 기준으로 내림차순 정렬
          setRankingData(sortedData.slice(0, 3)) // 상위 3명만 상태에 설정
        } else {
          console.error('Data is not an array:', data)
        }
      } catch (error) {
        console.error('Error fetching ranking data:', error) // 에러 발생 시 콘솔에 출력
      }
    }

    fetchRankingData() // fetchRankingData 함수 호출
  }, []) // 빈 배열을 의존성 배열로 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  // 더보기 버튼 클릭 시 /ranking 페이지로 이동
  const handleMoreClick = () => {
    navigate('/rank')
  }

  return (
    <div className="ranking-section-wrapper">
      <div className="ranking-section nes-container with-title is-rounded">
        {/* 섹션 제목 */}
        <textarea
          id="textarea_field"
          className="nes-textarea ranktitle"
          value="금주의 랭킹"
          readOnly
        />

        <ul className="ranking-list">
          {/* rankingData를 순회하여 각 항목을 렌더링 */}
          {rankingData.map((user, index) => (
            <li key={index} className="ranking-item">
              {/* 랭킹 순위 */}
              <span
                className={`rank-number nes-text ${
                  index === 0
                    ? 'is-success'
                    : index === 1
                    ? 'is-warning'
                    : 'is-error'
                }`}
              >
                {index + 1}
              </span>
              {/* 사용자 닉네임 */}
              <input
                type="text"
                className={`nes-input ${
                  index === 0
                    ? 'is-success'
                    : index === 1
                    ? 'is-warning'
                    : 'is-error'
                }`}
                value={user.userNickname || '---'}
                readOnly
              />
            </li>
          ))}
        </ul>
        {/* 더보기 버튼 */}
        <button className="nes-btn more-button" onClick={handleMoreClick}>
          더보기
        </button>
      </div>
    </div>
  )
}

export default Rank_week
