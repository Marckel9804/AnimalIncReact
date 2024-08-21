import React, {useEffect, useState} from 'react';

const BanModal = ({ data, onSave, onClose }) => {
    const [unlockDuration, setUnlockDuration] = useState(0); // 해제 기간 (일수)
    const [banReason, setBanReason] = useState(''); // 추가: BanReason 상태 관리

    useEffect(() => {
        if (data && data.banReason) {
            setBanReason(data.banReason);
        }
    }, [data]);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';  // dateTime이 undefined 또는 null일 경우 빈 문자열 반환
        const [date, time] = dateTime.split('T');
        const formattedTime = time ? time.split('.')[0] : '';
        return `${date} ${formattedTime}`;
    };

    const handleDurationChange = (event) => {
        setUnlockDuration(event.target.value);
    };

    const handleBanReasonChange = (event) => {
        setBanReason(event.target.value);
    };

    const handleSave = () => {
        const updatedData = {
            banId: data[0],
            userNum: data[1],
            unlockDate: calculateUnlockDate(data[3], unlockDuration),
            banReason: banReason,
        };
        onSave(updatedData);
        onClose();  // 모달 닫기
    };

    const calculateUnlockDate = (startDate, daysToAdd) => {
        if (!startDate) return '';  // startDate가 undefined일 경우 빈 문자열 반환
        const date = new Date(startDate);
        date.setDate(date.getDate() + parseInt(daysToAdd));
        return date.toISOString().split('T')[0] + ' ' + date.toISOString().split('T')[1].split('.')[0];
    };

    return (
        <div>
            <div className='flex justify-center font-bold text-3xl'> 밴 수정하기</div>
            <div>BanID : {data[0]}</div>
            <div>UserNo : {data[1]}</div>
            <div>
                정지 사유:
                <input
                    type="text"
                    value={banReason}
                    onChange={handleBanReasonChange}
                    className='nes-input'
                />
            </div>
            <div>정지 일자 : {formatDateTime(data[3])}</div>
            <div>해금 일자 : {calculateUnlockDate(data[3], unlockDuration)}</div>

            <div className='flex gap-3 pt-4'>
                <div className='nes-select is-warning w-40'>
                    <select
                        value={unlockDuration}
                        onChange={handleDurationChange}
                        className='text-2xl'
                    >
                        <option value={0}>해제</option>
                        <option value={1}>1일</option>
                        <option value={7}>7일</option>
                        <option value={30}>1달</option>
                        <option value={365}>1년</option>
                        <option value={3650}>10년</option>
                    </select>
                </div>
                <button
                    style={{color: 'white', fontWeight: '600'}}
                    className='nes-btn is-warning'
                    onClick={handleSave}
                >
                    수정
                </button>
            </div>
        </div>
    );
};

export default BanModal;
