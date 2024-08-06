import {useNavigate, useParams} from "react-router-dom";
import BoardWriteLayout from "../layout/BoardWriteLayout.jsx";
import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";

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
    <div id='BoardWritePage' className='flex mt-10 justify-center'>

      <BoardWriteLayout type={type} email={email}/>
    </div>
  )
}

export default BoardWritePage