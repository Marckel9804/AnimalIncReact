import React, { useEffect, useRef, useState } from 'react'
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk'
import { nanoid } from 'nanoid'
import { useLocation, useNavigate } from 'react-router-dom'
import './CheckoutPage.css'
import Header from '../Header'
import Footer from '../Footer'
import axios from '../../utils/axios.js'

const widgetClientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
const customerKey = nanoid()

const CheckoutPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [paymentWidget, setPaymentWidget] = useState(null)
  const paymentMethodsWidgetRef = useRef(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [userInfo, setUserInfo] = useState({
    userNickname: '',
    userRuby: 0,
    userPoint: 0,
  })

  const queryParams = new URLSearchParams(location.search)
  const rubyAmount = queryParams.get('amount')
  const rubyPrice = queryParams.get('price')

  const getUserInfo = async () => {
    try {
      const response = await axios.get('/api/user/get-profile')
      return response.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      return {
        userNickname: '',
        userRuby: 0,
        userPoint: 0,
      }
    }
  }

  useEffect(() => {
    console.log('Payment Widget useEffect executed')
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey
        )
        setPaymentWidget(loadedWidget)
        console.log('Payment Widget loaded')
      } catch (error) {
        console.error('Error fetching payment widget:', error)
      }
    }

    fetchPaymentWidget()
  }, [])

  useEffect(() => {
    if (paymentWidget == null) {
      return
    }

    console.log('Rendering payment methods')

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      '#payment-widget',
      { value: rubyPrice },
      { variantKey: 'DEFAULT' }
    )

    paymentMethodsWidget.on('methodSelected', (method) => {
      console.log('Payment method selected:', method.methodKey)
      setSelectedPaymentMethod(method.methodKey)
    })

    paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })

    paymentMethodsWidgetRef.current = paymentMethodsWidget
  }, [paymentWidget, rubyPrice])

  const handleConfirmPayment = async () => {
    console.log('handleConfirmPayment called')
    try {
      const userInfo = await getUserInfo()
      const userEmail = userInfo.userEmail
      const orderId = nanoid()

      console.log('Order ID:', orderId)
      console.log('User Email:', userEmail)
      console.log('Ruby Amount:', rubyAmount)
      console.log('Ruby Price:', rubyPrice)

      await axios.post('/payments/initiate', {
        orderId: orderId,
        userEmail: userEmail,
        amount: rubyPrice,
      })

      await paymentWidget?.requestPayment({
        orderId: orderId,
        orderName: `루비 ${rubyAmount}개 충전`,
        customerName: userInfo.userNickname,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      })

      // 결제 성공 페이지로 이동
      navigate('/success')
    } catch (error) {
      console.error('Error requesting payment:', error)
      navigate('/fail')
    }
  }

  return (
    <>
      <Header />
      <div id="backImg" />
      <div className="checkout-container">
        <div className="payment-container with-border">
          <div className="payment-widget-container">
            <div id="payment-widget" />
            <div id="agreement" />
            <div
              className={`installment-options ${
                selectedPaymentMethod === '카드' ? 'visible' : ''
              }`}
            ></div>
            <button className="payment-button" onClick={handleConfirmPayment}>
              결제하기
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CheckoutPage
