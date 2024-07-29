import React from 'react';
import {useGoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';
import axios from "../utils/axios.js";
import {useNavigate} from 'react-router-dom';
import googleLogo from '../image/google_logo.png';
import '../styles/login/GoogleLogin.css';

const GoogleLogin = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = async (tokenResponse) => {
        try {
            const {access_token} = tokenResponse;
            const {data} = await axios.get(`/members/google/userinfo?access_token=${access_token}`);
            const {sub: socialId, name, email} = data;

            const result = await axios.post('/members/social-login', {
                socialId,
                platform: 'google',
                name,
                email,
            });

            const response = result.data;
            if (response.status === 'error') {
                alert(response.message);
                return;
            }

            const member = response.member;
            if (!member) {
                throw new Error('Member data is not defined in the response.');
            }

            sessionStorage.setItem('member', JSON.stringify(member));
            navigate('/main');
        } catch (error) {
            console.error('Google login error:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            alert('구글 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const login = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: (error) => {
            console.error('Google login error:', error);
            alert('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
        },
    });

    return (
        <div className="google-login-btn" onClick={login}>
            <img src={googleLogo} alt="Google로 로그인"/>
            <span>Google로 로그인</span>
        </div>
    );
};

const GoogleLoginPage = () => {
    const clientId = "975411602786-m61p0e7053pnrpi7j4gl92ftmdpjkj8u.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin/>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginPage;
