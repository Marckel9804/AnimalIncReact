import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import GoogleLogin from './GoogleLogin';
import NaverLogin from './NaverLogin';
import KakaoLogin from './KakaoLogin';
import '../styles/login/Login.css';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/user/login', {
                userId,
                password,
            });

            const member = response.data;
            if (!member) {
                throw new Error('Member data is not defined in the response.');
            }

            sessionStorage.setItem('member', JSON.stringify(member));
            navigate('/main');
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="container-p">
            <div className="Box-p">
                <div className="logoTitle-p">
                    <h1 className="title-p">Animal Corporation</h1>
                    <div>
                        ID <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    </div>
                    <div>
                        Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleLogin}>로그인</button>
                </div>
                <div className="login-btns">
                    <GoogleLogin />
                    <NaverLogin />
                    <KakaoLogin />
                </div>
                <div>
                    <a href="/register" className="register-link">회원 가입</a> |
                    <a href="/find-id" className="find-id-link">ID 찾기</a> |
                    <a href="/find-password" className="find-password-link">비밀번호 찾기</a>
                </div>
                <div className="login-footer">
                    <span>서비스 약관 | </span>
                    <span>개인정보 처리방침 | </span>
                    <span>이용약관 | </span>
                    <span><a href="/notices" className="notice-link">공지사항</a> | </span>
                    <span><a href="/notices-board" className="notice-link">QnA</a></span>
                </div>
            </div>
        </div>
    );
};

export default Login;
