import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import GoogleLogin from "./GoogleLogin";
import NaverLogin from "./NaverLogin";
import KakaoLogin from "./KakaoLogin";
import "../styles/login/Login.css";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("/api/user/login", {
                userEmail: email,
                userPw: password,
            });
            const authorizationHeader = response.headers['authorization'];
            if (authorizationHeader) {
                const accessToken = authorizationHeader.split(' ')[1];
                localStorage.setItem('accessToken', accessToken);
                const base64Url = accessToken.split('.')[1]; // 페이로드 부분 추출
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64Url -> Base64
                const payload = JSON.parse(atob(base64)); // Base64 디코딩 후 JSON 파싱
                const roles = payload.roleName; // roleName 접근
                console.log(roles); // ["USER", "ADMIN"]
                if (roles.includes('ADMIN')) {
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
            console.error("Login error:", error);
            if (error.response && error.response.status === 403) {
                const banMessage = error.response.data.message;
                const banReason = error.response.data.banReason;
                const unlockDate = new Date(error.response.data.unlockDate);

                // unlockDate를 yyyy-MM-dd HH:mm 형식으로 변환
                const formattedUnlockDate = `${unlockDate.getFullYear()}-${String(unlockDate.getMonth() + 1).padStart(2, '0')}-${String(unlockDate.getDate()).padStart(2, '0')} ${String(unlockDate.getHours()).padStart(2, '0')}:${String(unlockDate.getMinutes()).padStart(2, '0')}`;

                // 밴된 경우의 처리
                alert(`${banMessage}\n\n정지 사유: ${banReason}\n정지 기간: ${formattedUnlockDate}`);
                navigate('/login');
            } else if (error.response && typeof error.response.data === 'string') {
                // 오류 메시지가 문자열일 경우
                alert(error.response.data);
            } else {
                // 다른 오류 처리
                alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <>
            <Header/>
            <div className="login-page">
                <div className="login-form with-title is-rounded">
                    <div className="Box-p">
                        <div className="logoTitle-p">
                            <h1 className="title-p">Animal, Inc.</h1>
                            <div className="login-id">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="아이디(이메일 주소)"
                                    className="login-input" // 입력 필드에 클래스 추가
                                />
                            </div>
                            <div className="login-pw">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호"
                                    className="login-input" // 입력 필드에 클래스 추가
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            <button
                                onClick={handleLogin}
                                id="loginButton"
                                className="nes-btn is-primary"
                            >
                                로그인
                            </button>
                        </div>
                        <div className="login-btns">
                            <GoogleLogin/>
                            <KakaoLogin/>
                            <NaverLogin/>
                        </div>
                        <div className="find">
                            <a href="/register" className="register-link">
                                회원 가입
                            </a>{" "}
                            |
                            <a href="/find-password" className="find-password-link">
                                비밀번호 찾기
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="backImg"/>
            <Footer/>
        </>
    );
};

export default Login;