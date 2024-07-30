import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import '../styles/login/Register.css';

const Register = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!isEmailVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        try {
            const response = await axios.post('/api/user/register', {
                name,
                userId,
                password,
                nickname,
                email,
                birthdate,
            });

            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {
            console.error('Register error:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const checkNicknameAvailability = async () => {
        try {
            const response = await axios.post('/api/user/check-nickname', { nickname });
            setIsNicknameAvailable(response.data.isAvailable);
        } catch (error) {
            console.error('Nickname check error:', error);
            alert('닉네임 중복 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const sendVerificationCode = async () => {
        try {
            await axios.post('/api/user/send-verification-code', { email });
            setIsVerificationCodeSent(true);
        } catch (error) {
            console.error('Send verification code error:', error);
            alert('인증번호 전송 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const verifyEmail = async () => {
        try {
            const response = await axios.post('/api/user/verify-email', { email, verificationCode });
            setIsEmailVerified(response.data.isVerified);
            if (response.data.isVerified) {
                alert('이메일 인증이 완료되었습니다.');
            } else {
                alert('인증번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('Email verification error:', error);
            alert('이메일 인증 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="register-page">
            <div className="register-form with-title is-rounded">
                <h1 className="title-p">회원 가입</h1>
                <div className="register-input">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름"/>
                </div>
                <div className="register-input">
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디"/>
                </div>
                <div className="register-input">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           placeholder="비밀번호"/>
                </div>
                <div className="register-input">
                    <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                           placeholder="비밀번호 확인"/>
                </div>
                <div className="register-input">
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임"/>
                    <button type="button" className="nes-btn" onClick={checkNicknameAvailability}>중복 확인</button>
                </div>
                {isNicknameAvailable === false && <div className="error-message">이미 사용 중인 닉네임입니다.</div>}
                {isNicknameAvailable === true && <div className="success-message">사용 가능한 닉네임입니다.</div>}
                <div className="register-input">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일"/>
                    <button type="button" className="nes-btn" onClick={sendVerificationCode}>인증번호 전송</button>
                </div>
                {isVerificationCodeSent && (
                    <div className="register-input">
                        <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
                               placeholder="인증번호 입력"/>
                        <button type="button" className="nes-btn" onClick={verifyEmail}>인증 확인</button>
                    </div>
                )}
                <div className="register-input">
                    <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
                           placeholder="생년월일"/>
                </div>
                <button onClick={handleRegister} id="registerButton" className="nes-btn">회원 가입</button>
            </div>
        </div>
    );
};

export default Register;
