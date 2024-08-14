const BanModal = (props) => {
  const {data} = props

  return(
    <div>
      <div>BanID : {data[0]}</div>
      <div>UserNo : {data[1]}</div>
      <div>정지 사유 : {data[2]}</div>
      <div>정지 넣은 일 : {data[3]}</div>
      <div>정지 풀리는 일 : {data[4]}</div>
    </div>
  )
}

export default BanModal