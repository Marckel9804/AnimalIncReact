import React, { useEffect, useState } from 'react';
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

                    const result = await axios.post('/api/user/social-login', {
                        email,
                        name,
                        platform: 'Kakao'
                    });

                    const authorizationHeader = result.headers['authorization'];
                    if (authorizationHeader) {
                        const newAccessToken = authorizationHeader.split(' ')[1];
                        localStorage.setItem('accessToken', newAccessToken);

                        const user = result.data.user;
                        if (!user.userBirthdate || !user.userNickname) {
                            alert("프로필을 완성해주세요.");
                            navigate('/check-profile', { state: { token: newAccessToken } });
                        } else {
                            navigate('/');
                        }
                    } else {
                        console.error('Authorization header is missing in the response');
                        throw new Error('Authorization header is missing in the response');
                    }
                } catch (error) {
                    console.error('Kakao login error:', error);
                    if (error.response && error.response.data) {
                        alert(error.response.data);
                        navigate('/login');
                    } else {
                        alert('카카오 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
                        navigate('/login');
                    }
                }
            },
            fail: (error) => {
                console.error('Kakao login error:', error);
                alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    };

    return (
        <div className="kakao-div">
            <button className="kakao-login-btn" onClick={handleLogin}>
                <img src={kakaoLogin} alt="Kakao Login" className="kakao-login-image nes-pointer" />
            </button>
        </div>
    );
};

export default KakaoLogin;
