import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const NaverCallback = () => {
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
            const response = await axios.get(`https://openapi.naver.com/v1/nid/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.data) {
                const { id: socialId, name, email } = response.data.response;
                handleLoginSuccess({ socialId, name, email }, 'naver');
            } else {
                console.error('Failed to get user info from Naver.');
                alert('네이버 사용자 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error fetching user info from Naver:', error);
            alert('네이버 사용자 정보를 가져오는 중 오류가 발생했습니다.');
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

export default NaverCallback;
