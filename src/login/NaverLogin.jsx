import React, { useEffect, useRef } from 'react';
import '../styles/login/NaverLogin.css';

const NaverLogin = () => {
    const naverRef = useRef();

    useEffect(() => {
        const naverLogin = new window.naver.LoginWithNaverId({
            clientId: 'YOUR_NAVER_CLIENT_ID',
            callbackUrl: 'http://localhost:3600/naver-callback',
            isPopup: false,
            loginButton: { color: 'green', type: 3, height: 20 }
        });
        naverLogin.init();
    }, []);

    return <div id="naverIdLogin" ref={naverRef} className="naverClassLogin" />;
};

export default NaverLogin;
