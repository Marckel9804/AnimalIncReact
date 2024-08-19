import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../utils/axios.js' // axios 임포트
import Header from '../Header'
import Footer from '../Footer'
import './SuccessPage.css'

const SuccessPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [userInfo, setUserInfo] = useState({
    userNickname: '',
    userRuby: 0,
    userPoint: 0,
  })

  useEffect(() => {
    const requestData = {
      paymentKey: searchParams.get('paymentKey'),
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
    }

    async function confirm() {
      try {
        const response = await axios.post('/payments/approve', null, {
          params: requestData,
        })

        // 결제 성공 시 알림 창 표시
        setShowSuccessAlert(true)

        // 결제 후 사용자 정보를 갱신하여 루비 수를 업데이트
        await updateUserInfo()

        // 3초 후 메인 페이지로 이동
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } catch (error) {
        console.error('Error confirming payment:', error)
        navigate(
          `/fail?message=${
            error.response?.data || '결제 확인 중 오류가 발생했습니다.'
          }&code=${error.response?.status || 500}`
        )
      }
    }

    confirm()
  }, [navigate, searchParams])

  // 사용자 정보 업데이트 함수
  async function updateUserInfo() {
    try {
      const response = await axios.get('/api/user/get-profile')
      // 사용자 정보 상태 업데이트
      setUserInfo({
        userNickname: response.data.userNickname,
        userRuby: response.data.userRuby,
        userPoint: response.data.userPoint,
      })
      console.log('Updated user info:', response.data)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  return (
    <>
      <Header />
      <div className="success-container">
        {showSuccessAlert && (
          <div className="success-alert-container">
            <div className="success-alert-box">
              <h3 className="success-alert-title">
                <span className="checkbox-wrapper">
                  <input type="checkbox" checked readOnly />
                  <svg viewBox="0 0 36 36">
                    <path
                      className="background"
                      d="M18 36C8.1 36 0 27.9 0 18S8.1 0 18 0s18 8.1 18 18-8.1 18-18 18z"
                    />
                    <path className="stroke" d="M25.5 11.5l-10 10-5-5" />
                    <path className="check" d="M10 18l5 5 10-10" />
                  </svg>
                </span>
                결제 성공
              </h3>
              <p className="success-alert-message">
                결제가 성공적으로 완료되었습니다.
              </p>
              <p className="success-alert-message">
                현재 루비: {userInfo.userRuby}
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default SuccessPage
