import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import kakaoLogin from "../image/kakao.png";
import axios from '../utils/axios.js';
import '../styles/login/KakaoLogin.css';

const KakaoLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('63b019d082230f67471565843bf93691');
        }
    }, []);

    const handleLogin = () => {
        window.Kakao.Auth.login({
            success: async (authObj) => {
                const accessToken = authObj.access_token;
                try {
                    const userInfo = await window.Kakao.API.request({
                        url: '/v2/user/me',
                    });
                    const { email, name } = userInfo.kakao_account;

                    await handleLoginSuccess({ email, name });
                } catch (error) {
                    console.error('Kakao API request error:', error);
                    alert('카카오 API 요청 중 오류가 발생했습니다.');
                    return;
                }
            },
            fail: (error) => {
                console.error('Kakao login error:', error);
                alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    };

    const handleLoginSuccess = async (userInfo) => {
        const { email, name } = userInfo;

        try {
            const result = await axios.post('/api/user/social-login', {
                email,
                name
            });

            const tokens = result.data;
            if (!tokens.accessToken || !tokens.refreshToken) {
                throw new Error('Token data is not defined in the response.');
            }

            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            navigate('/main');
        } catch (error) {
            console.error('Social login error:', error);
            alert('소셜 로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <button className="kakao-login-btn" onClick={handleLogin}>
            <img src={kakaoLogin} alt="kakaoLogin" className="kakao-login-image nes-pointer" />
        </button>
    );
};

export default KakaoLogin;
