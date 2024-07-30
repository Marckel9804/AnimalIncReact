import React from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../image/google_logo.png';
import '../styles/login/GoogleLogin.css';

const GoogleLogin = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = async (tokenResponse) => {
        const { access_token } = tokenResponse;
        window.location.href = `/google/callback?access_token=${access_token}`;
    };

    const login = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: (error) => {
            console.error('Google login error:', error);
            alert('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
        },
    });

    return (
        <div className="" onClick={login}>
            <i className="nes-icon google is-large nes-pointer"/>
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
