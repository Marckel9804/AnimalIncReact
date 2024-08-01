import React from 'react'
import './Footer.css'
import instagram from '../assets/images/instagram.png'
import facebook from '../assets/images/facebook.png'
import twitter from '../assets/images/twitter.png'

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-icons">
          <img src={facebook} alt="Facebook" />
          <img src={instagram} alt="Instagram" />
          <img src={twitter} alt="Twitter" />
        </div>
        <div className="footer-info">
          <p>(주)Animal 주식회사</p>
          <p>전유탁 | 서창호 | 김태웅 | 홍화연 | 오태경 | 유가영</p>
          <p>
            <a
              href="#terms"
              style={{ color: '#4cbdb8', textDecoration: 'underline' }}
            >
              이용약관
            </a>{' '}
            |
            <a
              href="#privacy"
              style={{ color: '#4cbdb8', textDecoration: 'underline' }}
            >
              개인정보처리방침
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
