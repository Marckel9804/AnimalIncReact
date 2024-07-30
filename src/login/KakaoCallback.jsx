import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const KakaoCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAccessToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const accessToken = urlParams.get('access_token');

            if (accessToken) {
                await getUserInfo(accessToken);
            } else {
                console.error('No access token found.');
                alert('액세스 토큰이 없습니다.');
            }
        };

        handleAccessToken();
    }, []);

    const getUserInfo = async (accessToken) => {
        try {
            const response = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.data) {
                const { id: socialId, properties: { nickname: name }, kakao_account: { email } } = response.data;
                handleLoginSuccess({ socialId, name, email }, 'kakao');
            } else {
                console.error('Failed to get user info from Kakao.');
                alert('Kakao 사용자 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error fetching user info from Kakao:', error);
            alert('Kakao 사용자 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handleLoginSuccess = async (userInfo, platform) => {
        const { socialId, name, email } = userInfo;

        try {
            const result = await axios.post('/api/user/social-login', {
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

            const member = response;
            if (!member) {
                throw new Error('Member data is not defined in the response.');
            }

            sessionStorage.setItem('member', JSON.stringify(member));
            if (!member.user_nickname) {
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

export default KakaoCallback;
