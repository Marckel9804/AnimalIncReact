import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import '../styles/login/Register.css';

const Register = () => {
    const [emailUser, setEmailUser] = useState('');
    const [emailDomain, setEmailDomain] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const [nicknameError, setNicknameError] = useState('');
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

        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const email = `${emailUser}@${emailDomain}`;

            const formattedBirthdate = `${birthdate.slice(0, 4)}-${birthdate.slice(4, 6)}-${birthdate.slice(6, 8)}`;

            const response = await axios.post('/api/user/register', {
                userEmail: email,
                userRealname: name,
                userPw: password,
                userNickname: nickname,
                userBirthdate: formattedBirthdate
            });

            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {
            console.error('Register error:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const checkNicknameAvailability = async () => {
        if (nickname.trim() === '') {
            setNicknameError('닉네임을 입력해주세요.');
            setIsNicknameAvailable(null);
            return;
        }
        try {
            const response = await axios.post('/api/user/check-nickname', { nickname });
            setIsNicknameAvailable(response.data.isAvailable);
        } catch (error) {
            console.error('Nickname check error:', error);
            alert('닉네임 중복 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const sendVerificationCode = async () => {
        if (!emailUser || !emailDomain) {
            alert('이메일을 입력해주세요');
            return;
        }
        const email = `${emailUser}@${emailDomain}`;
        try {
            const response = await axios.post('/api/user/send-verification-code', { email });
            setIsVerificationCodeSent(true);
            alert('인증번호가 이메일로 전송되었습니다.');
        } catch (error) {
            console.error('Send verification code error:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('인증번호 전송 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const verifyEmail = async () => {
        const email = `${emailUser}@${emailDomain}`;
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

    const handleDomainChange = (e) => {
        const selectedDomain = e.target.value;
        if (selectedDomain !== 'custom') {
            setEmailDomain(selectedDomain);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="register-page">
            <div className="register-form with-title is-rounded">
                <h1 className="title-p">회원 가입</h1>
                <div className="register-input">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름"/>
                </div>
                <div className="register-input email-input">
                    <input type="text" value={emailUser} onChange={(e) => setEmailUser(e.target.value)}
                           placeholder="이메일"/>
                    <span>@</span>
                    <input type="text" value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)}
                           placeholder="도메인"/>
                    <select onChange={handleDomainChange}>
                        <option value="custom">직접 입력</option>
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="daum.net">daum.net</option>
                        <option value="nate.com">nate.com</option>
                        <option value="hanmail.net">hanmail.net</option>
                    </select>
                    <button type="button" id="send-verification-code-button" className="nes-btn"
                            onClick={sendVerificationCode}>이메일 인증
                    </button>
                </div>
                {isVerificationCodeSent && (
                    <div className="register-input">
                        <input type="text" value={verificationCode}
                               onChange={(e) => setVerificationCode(e.target.value)}
                               placeholder="인증번호 입력"/>
                        <button type="button" id="verify-email-button" className="nes-btn" onClick={verifyEmail}>인증 확인
                        </button>
                    </div>
                )}
                <div className="register-input">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           placeholder="비밀번호"/>
                </div>
                <div className="register-input">
                    <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                           placeholder="비밀번호 확인"/>
                </div>
                <div className="register-input">
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                           placeholder="닉네임"/>
                    <button type="button" id="check-nickname-button" className="nes-btn"
                            onClick={checkNicknameAvailability}>중복 확인
                    </button>
                </div>
                {nicknameError && <div className="error-message">{nicknameError}</div>}
                {isNicknameAvailable === false && <div className="error-message">이미 사용 중인 닉네임입니다...</div>}
                {isNicknameAvailable === true && <div className="success-message">사용 가능한 닉네임입니다!!!</div>}
                <div className="register-input">
                    <input type="text" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
                           placeholder="생년월일 (YYYYMMDD)"/>
                </div>
                <div className="button-container">
                    <button onClick={handleRegister} id="registerButton" className="nes-btn is-primary">회원 가입</button>
                    <button onClick={handleCancel} id="cancelButton" className="nes-btn is-error">뒤로 가기</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
