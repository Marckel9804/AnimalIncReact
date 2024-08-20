import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import '../styles/login/CheckProfile.css';

const CompleteProfile = () => {
    const [birthdate, setBirthdate] = useState('');
    const [nickname, setNickname] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const [nicknameError, setNicknameError] = useState('');
    const navigate = useNavigate();

    const checkNicknameAvailability = async () => {
        if (nickname.trim() === '') {
            setNicknameError('닉네임을 입력해주세요.');
            setIsNicknameAvailable(null);
            return;
        }

        try {
            const response = await axios.post('/api/user/check-nickname', { nickname });
            setIsNicknameAvailable(response.data.isAvailable);
            setNicknameError(''); // Clear the error message
        } catch (error) {
            console.error('Nickname check error:', error);
            alert('닉네임 중복 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const handleCompleteProfile = async () => {

        if (nickname.trim() === '' || birthdate === '') {
            alert('닉네임과 생년월일 모두 입력해주세요')
            return;
        }

        if (isNicknameAvailable === null) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }

        const formattedBirthdate = `${birthdate.slice(0, 4)}-${birthdate.slice(4, 6)}-${birthdate.slice(6, 8)}`;

        try {
            const response = await axios.post('/api/user/check-profile', {
                birthdate: formattedBirthdate,
                nickname
            });

            alert('프로필이 완성되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('Complete profile error:', error);
            alert('프로필 완성 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const isValidBirthdate = (date) => {
        if (!/^\d{8}$/.test(date)) {
            return false;
        }

        const year = parseInt(date.slice(0, 4), 10);
        const month = parseInt(date.slice(4, 6), 10);
        const day = parseInt(date.slice(6, 8), 10);

        if (year < 1900 || year > 2024) {
            return false;
        }

        if (month < 1  || month > 12) {
            return false;
        }

        if (day < 1 || day < 31) {
            return false;
        }

        const dateObj = new Date(`${year} - ${month} - ${day}`);
        return dateObj && dateObj.getMonth() + 1 === month && dateObj.getDate() === day;
    }

    return (
        <div className="complete-profile-page">
            <div className="complete-profile-form with-title is-rounded">
                <h1 className="title-p">프로필 완성</h1>
                <div className="complete-profile-input">
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                           placeholder="닉네임"/>
                    <button type="button" id="check-nickname-button" className="nes-btn"
                            onClick={checkNicknameAvailability}>중복 확인
                    </button>
                </div>
                {nicknameError && <div id="error-message">{nicknameError}</div>}
                {isNicknameAvailable === false && <div id="error-message">이미 사용 중인 닉네임입니다...</div>}
                {isNicknameAvailable === true && <div id="success-message">사용 가능한 닉네임입니다!!!</div>}
                <div className="complete-profile-input">
                    <input type="text" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
                           placeholder="생년월일 (YYYYMMDD)"/>
                </div>
                <div className="button-container">
                    <button onClick={handleCompleteProfile} id="completeProfileButton" className="nes-btn is-primary">완성</button>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
