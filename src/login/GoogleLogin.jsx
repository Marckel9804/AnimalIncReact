import React from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import '../styles/login/GoogleLogin.css';

const GoogleLogin = () => {
    const handleLoginSuccess = async (tokenResponse) => {
        const { access_token } = tokenResponse;
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
            const userInfo = await response.json();
            const { email, name } = userInfo; // Google API에서 제공되는 필드명 확인 필요
            await fetch('http://localhost:8080/api/user/social-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });
        } catch (error) {
            console.error('Google login error:', error);
            alert('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
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
            <i className="nes-icon google is-medium nes-pointer"/>
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