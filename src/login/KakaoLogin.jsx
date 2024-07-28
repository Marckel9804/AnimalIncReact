import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import kakaoLogin from "../image/kakao_login.png";
import '../styles/login/KakaoLogin.css';

const KakaoLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('YOUR_KAKAO_JS_KEY');
        }
    }, []);

    const handleLogin = () => {
        window.Kakao.Auth.login({
            success: async (authObj) => {
                const accessToken = authObj.access_token;
                window.location.href = `/kakao-callback?access_token=${accessToken}`;
            },
            fail: (error) => {
                console.error('Kakao login error:', error);
                alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
            },
        });
    };

    return (
        <button className="kakao-login-btn" onClick={handleLogin}>
            <img src={kakaoLogin} alt="kakaoLogin" className="kakao-login-image" />
        </button>
    );
};

export default KakaoLogin;
