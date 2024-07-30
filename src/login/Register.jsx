import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';

const Register = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('/api/user/register', {
                userId,
                password,
                name,
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

    return (
        <div className="container-p">
            <div className="Box-p">
                <h1 className="title-p">회원 가입</h1>
                <div>
                    ID <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                </div>
                <div>
                    Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    Password Confirm <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>
                <div>
                    Name <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    Birthdate <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                </div>
                <button onClick={handleRegister}>회원 가입</button>
            </div>
        </div>
    );
};

export default Register;
