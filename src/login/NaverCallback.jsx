import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const NaverCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let urlParams = new URLSearchParams(window.location.hash.substring(1));
        let accessToken = urlParams.get('access_token');

        if (!accessToken) {
            urlParams = new URLSearchParams(window.location.search);
            accessToken = urlParams.get('access_token');
        }

        if (accessToken) {
            getUserInfo(accessToken);
        } else {
            console.error('No access token found.');
            alert('액세스 토큰이 없습니다.');
        }
    }, []);

    const getUserInfo = async (accessToken) => {
        try {
            const response = await axios.get(`https://bit-two.com/api/naver/user-info?accessToken=${accessToken}`);
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
            const result = await axios.post('https://bit-two.com/api/members/social-login', {
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

export default NaverCallback;
