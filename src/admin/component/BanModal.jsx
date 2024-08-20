const BanModal = (props) => {
  const {data} = props

  return (
    <div>
      <div className='flex justify-center font-bold text-3xl'> 벤 수정하기</div>
      <div>BanID : {data[0]}</div>
      <div>UserNo : {data[1]}</div>
      <div>정지 사유 : {data[2]}</div>
      <div>정지 일자 : {data[3]
        // .split('T')[0] + ' ' + data[3].split('T')[1].split('.')[0]
      }</div>
      <div>해금 일자 : {data[4]
        // .split('T')[0] + ' ' + data[4].split('T')[1].split('.')[0]
      }</div>

      <div className='flex gap-3 pt-4'>


        <div className='nes-select is-warning w-40'>
          <select value={0}
            // onChange={}
                  className='text-2xl'>
            <option value={0} hidden>...</option>
            <option value={0}>해제</option>
            <option value={1}>1일</option>
            <option value={7}>7일</option>
            <option value={30}>1달</option>
            <option value={365}>1년</option>
            <option value={3650}>10년</option>
          </select>
        </div>
        <button style={{color:'white', fontWeight:'600'}}
                className='nes-btn is-warning'>
          수정
        </button>
      </div>
    </div>
  )
}

export default BanModal