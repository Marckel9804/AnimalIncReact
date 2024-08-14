import React, { useEffect, useRef, useState } from 'react'
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk'
import { nanoid } from 'nanoid'
import './CheckoutPage.css' // CSS 파일을 임포트합니다.

const widgetClientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
const customerKey = nanoid() // 유니크한 customerKey 생성

const CheckoutPage = () => {
  const [paymentWidget, setPaymentWidget] = useState(null)
  const paymentMethodsWidgetRef = useRef(null)
  const [isPaymentRequested, setIsPaymentRequested] = useState(false)

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey
        )
        setPaymentWidget(loadedWidget)
      } catch (error) {
        console.error('Error fetching payment widget:', error)
      }
    }

    fetchPaymentWidget()
  }, [])

  useEffect(() => {
    if (paymentWidget == null || !isPaymentRequested) {
      return
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      '#payment-widget',
      { value: 50000 }, // 50,000원 고정 결제 금액
      { variantKey: 'DEFAULT' }
    )

    paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })

    paymentMethodsWidgetRef.current = paymentMethodsWidget
  }, [paymentWidget, isPaymentRequested])

  const handlePaymentRequest = async () => {
    setIsPaymentRequested(true)
  }

  const handleConfirmPayment = async () => {
    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: '루비 충전',
        customerName: '김토스',
        customerEmail: 'customer123@gmail.com',
        customerMobilePhone: '01012341234',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      })
    } catch (error) {
      console.error('Error requesting payment:', error)
    }
  }

  return (
    <div className="checkout-container">
      {!isPaymentRequested ? (
        <button className="payment-button" onClick={handlePaymentRequest}>
          결제하기
        </button>
      ) : (
        <div className="payment-widget-container">
          <div id="payment-widget" />
          <div id="agreement" />
          <button className="payment-button" onClick={handleConfirmPayment}>
            결제하기
          </button>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage
