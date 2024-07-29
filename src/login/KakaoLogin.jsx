import React, {useEffect} from 'react';
import axios from '../utils/axios';
import {useNavigate} from 'react-router-dom';
import kakaoLogin from "../image/kakao_login.png";
import '../styles/login/KakaoLogin.css';

const KakaoLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('556a6f2f18618bf8d0ac80fd3c79cc35');
        }
    }, []);

    const handleLogin = () => {
        window.Kakao.Auth.login({
            success: async (authObj) => {
                try {
                    const userInfo = await window.Kakao.API.request({
                        url: '/v2/user/me',
                    });
                    const {id: socialId, kakao_account: {profile: {nickname: name}, email}} = userInfo;
                    handleLoginSuccess({socialId, name, email}, 'kakao');
                } catch (error) {
                    console.error('Kakao API request error:', error);
                }
            },
        });
    };

    const handleLoginSuccess = async (userInfo, platform) => {
        const {socialId, name, email} = userInfo;

        try {
            const result = await axios.post('https://bit-two.com/api/members/social-login', {
                socialId,
                platform,
                name,
                email,
            }, {
                withCredentials: true
            });

            const response = result.data;
            if (response.status === 'error') {
                return;
            }

            const member = response.member;
            if (!member) {
                throw new Error('Member data is not defined in the response.');
            }

            sessionStorage.setItem('member', JSON.stringify(member));
            navigate('/main');
        } catch (error) {
            console.error('Social login error:', error);
        }
    };

    return (
        <button className="kakao-login-btn" onClick={handleLogin}>
            <img src={kakaoLogin} alt="kakaoLogin" className="kakao-login-image"/>
        </button>
    );
};

export default KakaoLogin;
