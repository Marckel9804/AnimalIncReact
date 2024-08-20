import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const NaverCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');

        if (accessToken) {
            const fetchUserInfo = async () => {
                try {
                    console.log('Fetching user info with access token:', accessToken);

                    const profileResponse = await axios.get('/api/user/naver-info', {
                        params: { access_token: accessToken }
                    });

                    console.log('Profile response:', profileResponse.data);

                    const userInfo = profileResponse.data.response;
                    const { email, name } = userInfo;

                    const result = await axios.post('/api/user/social-login', { email, name, platform: 'Naver' });

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
                    console.error('Naver callback error:', error);
                    console.error('Error details:', error.response || error.message || error);
                    if (error.response && error.response.data) {
                        alert(error.response.data);
                        navigate('/login');
                    } else {
                        alert('네이버 로그인 중 오류가 발생했습니다.');
                        navigate('/login');
                    }
                }
            };

            fetchUserInfo();
        } else {
            console.error('Access token is missing in the URL hash parameters.');
            alert('네이버 로그인 중 오류가 발생했습니다.');
        }
    }, [navigate]);

    return (
        <div>
            <div>Loading...</div>
        </div>
    );
};

export default NaverCallback;
