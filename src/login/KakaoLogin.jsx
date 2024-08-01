import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import kakaoLogin from "../image/kakao.png";
import '../styles/login/KakaoLogin.css';

const KakaoLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('556a6f2f18618bf8d0ac80fd3c79cc35');
        }
    }, []);

    const handleLogin = () => {
        window.Kakao.Auth.login({
            success: async (authObj) => {
                const accessToken = authObj.access_token;
                try {
                    const response = await fetch(`https://kapi.kakao.com/v2/user/me`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    const userInfo = await response.json();
                    const { email, properties: { nickname: name } } = userInfo.kakao_account;

                    await fetch('/api/user/social-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, name })
                    });
                } catch (error) {
                    console.error('Kakao login error:', error);
                    alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
                }
            },
            fail: (error) => {
                console.error('Kakao login error:', error);
                alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    };

    return (
        <button className="kakao-login-btn" onClick={handleLogin}>
            <img src={kakaoLogin} alt="kakaoLogin" className="kakao-login-image nes-pointer" />
        </button>
    );
};

export default KakaoLogin;
