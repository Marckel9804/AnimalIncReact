import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            getGoogleUserInfo(code);
        } else {
            console.error('No code found.');
            alert('코드가 없습니다.');
        }
    }, []);

    const getGoogleUserInfo = async (code) => {
        try {
            const response = await axios.get(`/api/google/callback?code=${code}`);
            if (response.data) {
                const { id: socialId, name, email } = response.data;
                handleLoginSuccess({ socialId, name, email }, 'google');
            } else {
                console.error('Failed to get user info from Google.');
                alert('Google 사용자 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error fetching user info from Google:', error);
            alert('Google 사용자 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handleLoginSuccess = async (userInfo, platform) => {
        const { socialId, name, email } = userInfo;

        try {
            const result = await axios.post('/api/members/social-login', {
                socialId,
                platform,
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
            sessionStorage.setItem('token', result.headers.authorization);
            if (!member.memberUsername) {
                navigate('/set-nickname');
            } else {
                navigate('/main');
            }
        } catch (error) {
            console.error('Social login error:', error);
            alert('소셜 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return <div>Loading...</div>;
};

export default GoogleCallback;
