/* global require, Buffer */

const express = require('express')
const got = require('got')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/confirm', function (req, res) {
  const { paymentKey, orderId, amount } = req.body

  const widgetSecretKey = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'
  const encryptedSecretKey =
    'Basic ' + Buffer.from(widgetSecretKey + ':').toString('base64')

  got
    .post('https://api.tosspayments.com/v1/payments/confirm', {
      headers: {
        Authorization: encryptedSecretKey,
        'Content-Type': 'application/json',
      },
      json: {
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      },
      responseType: 'json',
    })
    .then(function (response) {
      res.status(response.statusCode).json(response.body)
    })
    .catch(function (error) {
      res.status(error.response.statusCode).json(error.response.body)
    })
})

app.listen(4242, () =>
  console.log(`http://localhost:4242 으로 샘플 앱이 실행되었습니다.`)
)
