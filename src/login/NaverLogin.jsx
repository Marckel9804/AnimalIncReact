import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import naverLogin from '../image/naver.png';
import '../styles/login/NaverLogin.css';

const NaverLogin = () => {
    const navigate = useNavigate();
    const initialized = useRef(false); // 중복 실행 방지를 위한 useRef

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true; // 초기화 여부를 true로 설정

            const naverLogin = new window.naver.LoginWithNaverId({
                clientId: 'XtRHdGsf1DCObrQohYWO',
                callbackUrl: 'http://localhost:3600/naver/callback',
                isPopup: false,
                loginButton: { color: 'green', type: 1, height: 20 }
            });
            naverLogin.init();

            const loginButton = document.getElementById('naverIdLogin');
            if (loginButton) {
                loginButton.style.display = 'none';
            }
        }
    }, []);

    const handleLogin = () => {
        const loginButton = document.getElementById('naverIdLogin').firstChild;
        if (loginButton) {
            loginButton.click();
        }
    };

    return (
        <div>
            <div id="naverIdLogin" />
            <button onClick={handleLogin} className="customNaverLoginButton nes-pointer">
                <img src={naverLogin} alt="Naver Login" />
            </button>
        </div>
    );
};

export default NaverLogin;
