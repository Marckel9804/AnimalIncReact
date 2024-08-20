import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './FailPage.css'

const FailPage = () => {
  const [searchParams] = useSearchParams()

  return (
    <>
      <Header />
      <div id="backImg" />
      <div className="fail-container">
        <div className="fail-alert-container">
          <div className="fail-alert-box">
            <h3 className="fail-alert-title">
              <span className="checkbox-wrapper1">
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
              결제 실패
            </h3>
            <p className="fail-alert-message">
              에러 코드: {searchParams.get('code')}
            </p>
            <p className="fail-alert-message">
              실패 사유: {searchParams.get('message')}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default FailPage
