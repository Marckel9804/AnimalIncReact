import React, { useState } from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import '../styles/login/GoogleLogin.css';

const GoogleLogin = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = async (tokenResponse) => {
        const { access_token } = tokenResponse;
        try {
            const response = await axios.get(`/api/user/google-userinfo?access_token=${access_token}`);
            const userInfo = response.data;
            const { email, name } = userInfo;

            const result = await axios.post('/api/user/social-login', { email, name, platform: 'Google' });

            const authorizationHeader = result.headers['authorization'];
            if (authorizationHeader) {
                const newAccessToken = authorizationHeader.split(' ')[1];
                localStorage.setItem('accessToken', newAccessToken);

                const user = result.data.user;
                const base64Url = newAccessToken.split('.')[1]; // 페이로드 부분 추출
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64Url -> Base64
                const payload = JSON.parse(atob(base64)); // Base64 디코딩 후 JSON 파싱
                const roles = payload.roleName; // roleName 접근
                console.log(roles); // ["USER", "ADMIN"]
                if (!user.userBirthdate || !user.userNickname) {
                    alert("프로필을 완성해주세요.");
                    navigate('/check-profile', { state: { token: newAccessToken } });
                }
                else if (roles.includes('ADMIN')) {
                    navigate('/admin');
                }
                else {
                    navigate('/');
                }
            } else {
                console.error('Authorization header is missing in the response');
                throw new Error('Authorization header is missing in the response');
            }
        } catch (error) {
            console.error('Google login error:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
                navigate('/login');
            } else {
                alert('Google 로그인에 실패했습니다. 다시 시도해 주세요.');
                navigate('/login');
            }
        }
    };

    const login = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: (error) => {
            console.error('Google login error:', error);
            alert('Google 로그인에 실패했습니다. 다시 시도해 주세요.');
        },
    });

    return (
        <div className="google-login-container">
            <div className="google-login-btn" onClick={login}>
                <i className="nes-icon google is-medium nes-pointer" />
            </div>
        </div>
    );
};

const GoogleLoginPage = () => {
    const clientId = "691131005394-6u9f06b6hbje6thje9cu1n7hsm3tpsoj.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginPage;
