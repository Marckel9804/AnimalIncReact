import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const NaverCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const naverLogin = new window.naver.LoginWithNaverId({
            clientId: 'XtRHdGsf1DCObrQohYWO',
            callbackUrl: 'http://localhost:3600/naver/callback',
            isPopup: false
        });
        naverLogin.init();

        naverLogin.getLoginStatus(async (status) => {
            if (status) {
                const email = naverLogin.user.getEmail();
                const name = naverLogin.user.getNickName();
                await handleSocialLoginSuccess({ email, name });
            } else {
                console.error('Naver login status:', status);
                alert('네이버 로그인에 실패했습니다.');
            }
        });
    }, []);

    const handleSocialLoginSuccess = async (userInfo) => {
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

    return <div>Loading...</div>;
};

export default NaverCallback;
