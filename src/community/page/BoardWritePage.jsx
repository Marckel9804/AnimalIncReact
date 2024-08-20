import {useNavigate, useParams} from "react-router-dom";
import BoardWriteLayout from "../layout/BoardWriteLayout.jsx";
import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import '../Board.scss'
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import bgimg from "../../image/background.png"

const BoardWritePage = () => {

  const navi = useNavigate()
  const params = useParams()
  const type = params.type

  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.post(`/api/board/email`)
      .then((res)=> {
        setEmail(res.data.email)
        console.log(res.data);
      })
  }, [type]);

  return (
    <div id='BoardWritePage' className='flex-col justify-center w-full'>
      <Header/>
      <BoardWriteLayout type={type} email={email}/>
      <div id="board-bg" className='fixed top-0 left-0 h-dvh w-dvw  -z-10'
           style={{ backgroundImage: `url(${bgimg})`}}
      ></div>
    </div>
  )
}

export default BoardWritePage