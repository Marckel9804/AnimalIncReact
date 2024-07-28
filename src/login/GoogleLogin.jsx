import React from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../image/google_logo.png';
import '../styles/login/GoogleLogin.css';

const GoogleLogin = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = async (tokenResponse) => {
        const { access_token } = tokenResponse;
        window.location.href = `/google-callback?access_token=${access_token}`;
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
            <img src={googleLogo} alt="Google로 로그인" />
            <span>Google로 로그인</span>
        </div>
    );
};

const GoogleLoginPage = () => {
    const clientId = "YOUR_GOOGLE_CLIENT_ID";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginPage;
