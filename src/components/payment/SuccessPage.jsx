import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function SuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
      paymentKey: searchParams.get('paymentKey'),
    }

    async function confirm() {
      const response = await fetch('/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const json = await response.json()

      if (!response.ok) {
        navigate(`/fail?message=${json.message}&code=${json.code}`)
        return
      }
    }
    confirm()
  }, [])

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${searchParams.get('orderId')}`}</p>
        <p>{`결제 금액: ${Number(
          searchParams.get('amount')
        ).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get('paymentKey')}`}</p>
      </div>
    </div>
  )
}
