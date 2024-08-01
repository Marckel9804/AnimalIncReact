import React, { useState, useEffect } from 'react'
import './Rank_week.css'
import 'nes.css/css/nes.min.css' // NES.css 스타일 임포트

// Rank_week 컴포넌트 정의
const Rank_week = () => {
  // rankingData 상태를 기본적으로 3개의 빈 객체로 설정
  const [rankingData, setRankingData] = useState([{}, {}, {}])

  // 컴포넌트가 마운트될 때 한 번 실행되는 useEffect 훅
  useEffect(() => {
    // 비동기 함수로 API에서 랭킹 데이터를 가져오는 함수 정의
    const fetchRankingData = async () => {
      try {
        const response = await fetch('/ranking/weekly') // 랭킹 데이터를 가져오는 API 호출
        const data = await response.json() // 응답 데이터를 JSON 형식으로 파싱
        setRankingData(data) // 가져온 데이터를 상태에 설정
      } catch (error) {
        console.error('Error fetching ranking data:', error) // 에러 발생 시 콘솔에 출력
      }
    }

    fetchRankingData() // fetchRankingData 함수 호출
  }, []) // 빈 배열을 의존성 배열로 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <div className="ranking-section-wrapper">
      <div className="ranking-section nes-container with-title is-rounded">
        {/* 섹션 제목을 버튼으로 변경 */}
        <button className="ranktitle nes-btn is-success1">금주의 랭킹</button>

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
                value={user.user_nickname || '---'}
                readOnly
              />
            </li>
          ))}
        </ul>
        {/* 더보기 버튼 */}
        <button className="nes-btn is-primary1 more-button">더보기</button>
      </div>
    </div>
  )
}

export default Rank_week
