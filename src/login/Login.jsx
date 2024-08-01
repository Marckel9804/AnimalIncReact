import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import GoogleLogin from './GoogleLogin';
import NaverLogin from './NaverLogin';
import KakaoLogin from './KakaoLogin';
import '../styles/login/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/user/login', {
                userEmail: email,
                userPw: password,
            });
            console.log(response);

            const tokens = response.data;
            console.log(tokens);

            if (!tokens) {
                throw new Error('Token data is not defined in the response.');
            }

            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            navigate('/main');
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form with-title is-rounded">
                <div className="Box-p">
                    <div className="logoTitle-p">
                        <h1 className="title-p">Animal, Inc.</h1>
                        <div className="login-input">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="아이디(이메일 주소)"/>
                        </div>
                        <div className="login-input">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호"/>
                        </div>
                        <button onClick={handleLogin} id="loginButton" className="nes-btn is-primary">로그인</button>
                    </div>
                    <div className="login-btns">
                        <GoogleLogin />
                        <KakaoLogin />
                        <NaverLogin />
                    </div>
                    <div className="find">
                        <a href="/register" className="register-link">회원 가입</a> |
                        <a href="/find-password" className="find-password-link">비밀번호 찾기</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
