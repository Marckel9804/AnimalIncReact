import axios from "../utils/axios.js";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/login/FindPassword.css";

const FindPassword = () => {
    const [email, setEmail] = useState('');
    const [emailtoGetPassword, setEmailtoGetPassword] = useState(false);

    const navigate = useNavigate();

    const sendPassword = async () => {
        if (!email) {
            alert('이메일을 입력해주세요');
            return;
        }

        try {
            const response = await axios.post('/api/user/send-password', { email });
            setEmailtoGetPassword(true);
            alert('임시 비밀번호가 이메일로 전송되었습니다.');
            alert('임시 비밀번호로 로그인 해주세요!');
            navigate('/login')
        } catch (error) {
            console.error('Send verification code error:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('인증번호 전송 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };

    return (
        <>
            <Header/>
            <div className="find-password-page">
                <div className="find-password-form with-title is-rounded">
                    <div className="Box-p">
                        <div className="logoTitle-p">
                            <h1 className="title-p">비밀번호 찾기</h1>
                            <div className="find-email-input">
                                <input type="email"
                                       className="find-input-email"
                                       value={email}
                                       onChange={(e) => setEmail(e.target.value)}
                                       placeholder="이메일 입력"/>
                                <button type="button"
                                        id="find-send-btn"
                                        className="nes-btn"
                                        onClick={sendPassword}>
                                     비밀번호 찾기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="backImg"/>
            <Footer/>
        </>
    )
}

export default FindPassword;