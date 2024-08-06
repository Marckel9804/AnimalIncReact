import axios from "../utils/axios.js";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const FindPassword = () => {
    const [emailUser, setEmailUser] = useState('');
    const [emailDomain, setEmailDomain] = useState('');
    const [emailtoGetPassword, setEmailtoGetPassword] = useState(false);

    const navigate = useNavigate();

    const sendPassword = async () => {
        if (!emailUser || !emailDomain) {
            alert('이메일을 입력해주세요');
            return;
        }
        const email = `${emailUser}@${emailDomain}`;
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
        <div className="">
            <span>가입한 이메일을 입력하세요</span>
            <input type="text" value={emailUser} /> @ <input type="text" value={emailDomain} />
            <button type="button" className="nes-btn" onClick={sendPassword} />
        </div>
    )
}

export default FindPassword;