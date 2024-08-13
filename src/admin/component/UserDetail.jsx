import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";



const UserDetail = (props) => {
  const {data} = props
  const [period, setPeriod] = useState(0);
  const [reasonTag, setReasonTag]=useState('')
  const [reasonDetail, setReasonDetail]=useState('')

  useEffect(() => {
    console.log(data)
  }, [data]);

  const onBan = async () => {
    await alert(`진짜 사용자 no.${data[0]}를 ${period}일 동안 벤리스트에 올리시겠습니까?`)
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const now = Date.now()
    const unlockDate = now + (period * oneDayInMilliseconds)

    const formData = {
      userNum:data[0],
      unlockDate:unlockDate,
      banReason:'('+reasonTag+') '+reasonDetail,
      bannedDate:now,
    }
    await axios.post(`/api/admin/ban`, formData)
      .then((res)=> {
        console.log(res.data)
      })
      .catch((err)=> {
        console.log("add ban list ERROR!!", err)
      })
  }

  const onPeriod = (e) => {
    setPeriod(e.target.value)
  }

  const onReasonTag = (e) => {
    setReasonTag(e.target.value)
  }

  const onReasonDetail = (e) => {
    setReasonDetail(e.target.value)
  }

  return (
    <div>
      <div className='flex justify-center text-3xl font-bold'>
        사용자 상세정보
      </div>
      <div>.no : {data[0]}</div>
      <div>권한 : {data[1]}</div>
      <div>실명 : {data[2]}</div>
      <div>email : {data[3]}</div>
      <div>티어 : {data[4]}</div>
      <div>포인트 : {data[5]}</div>
      <div>루비 : {data[6]}</div>
      <div>신고횟수 : {data[7]}</div>
      <div>티어 : {data[8]}</div>
      <div>티어 : {data[9]}</div>

      <div className='nes-container with-title mt-3'>
        <p className='title'>사용자 정지</p>
        <div className='flex-col gap-y-4'>
          <div className='flex gap-3 mb-4'>
            <div className='nes-select is-error w-40'>
              <select value={period}
                      onChange={onPeriod}
                      className='text-red-800 text-2xl'>
                <option value={0} hidden>...</option>
                <option value={1}>1일</option>
                <option value={7}>7일</option>
                <option value={30}>1달</option>
                <option value={365}>1년</option>
                <option value={3650}>10년</option>
              </select>
            </div>
            <div className='nes-select is-error'>
              <select value={reasonTag}
                      onChange={onReasonTag}
                      className='text-red-800 text-2xl'>
                <option value={"x"} hidden>...</option>
                <option value={"욕설/비방"}>욕설/비방</option>
                <option value={"악의적인 게임플레이"}>악의적인 게임플레이</option>
                <option value={"불법 프로그램 사용/치트"}>불법 프로그램 사용/치트</option>
                <option value={"기타"}>기타</option>
              </select>
            </div>

          </div>

          <div className='flex gap-3'>

            <input className='nes-input is-error'
                   value={reasonDetail}
                   onChange={onReasonDetail}/>
            <button className='nes-btn is-error w-32'
                    onClick={onBan}>
              정지
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail