import React from 'react';
import GoogleLogin from './GoogleLogin';
import NaverLogin from './NaverLogin';
import KakaoLogin from './KakaoLogin';
import '../styles/login/Login.css';

const Login = () => {
    return (
        <div className="container-p">
            <div className="Box-p">
                <div className="logoTitle-p">
                    <h1 className="title-p">Animal Corporation</h1>
                    <div className="">
                        ID <input type="text" />
                    </div>
                    <div className="">
                        Password <input type="password" />
                    </div>
                </div>
                <div className="login-btns">
                    <GoogleLogin />
                    <NaverLogin />
                    <KakaoLogin />
                </div>
                <div>
                    <a href={"/login"} className="login-link">로그인</a> |
                    <a href={"/register"} className="register-link">회원 가입</a> |
                    <a href={"/find-id"} className="find-id-link">ID 찾기</a> |
                    <a href={"/find-password"} className="find-password-link">비밀번호 찾기</a>
                </div>
                <div className="login-footer">
                    <span>서비스 약관 | </span>
                    <span>개인정보 처리방침 | </span>
                    <span>이용약관 | </span>
                    <span><a href={"/notices"} className="notice-link">공지사항</a> | </span>
                    <span><a href={"/notices-board"} className="notice-link">QnA</a></span>
                </div>
            </div>
        </div>
    );
};

export default Login;
