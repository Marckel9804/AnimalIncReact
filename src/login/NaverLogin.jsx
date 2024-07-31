import React, { useEffect } from 'react';
import '../styles/login/NaverLogin.css';
import naverLogin from '../image/naver.png';
const NaverLogin = () => {
    useEffect(() => {
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
    }, []);

    const handleNaverLogin = () => {
        const loginButton = document.getElementById('naverIdLogin').firstChild;
        if (loginButton) {
            loginButton.click();
        }
    };

    return (
        <div>
            <div id="naverIdLogin"/>
            <button onClick={handleNaverLogin} className="customNaverLoginButton">
                <img src={naverLogin} alt="Naver Login" />
            </button>
        </div>
    );
};

export default NaverLogin;
