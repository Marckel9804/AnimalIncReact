import {useLocation, useNavigate, useParams} from "react-router-dom";
import BoardDetailLayout from "../layout/BoardDetailLayout.jsx";
import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import {jwtDecode} from "jwt-decode";
import Header from "../../components/Header.jsx";
import bgimg from "../../assets/images/background.jpg";



const BoardDetailPage = () => {

  const params = useParams()
  const location = useLocation()
  const id = params.id;
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page') || '0';
  const [data, setData] = useState({bcId:0,content:'',title:'',userNum:0,code:''});

  const token = localStorage.getItem('accessToken')
  const decodeToken = jwtDecode(token)
  const mEmail = decodeToken.userEmail;
  console.log('role ', mEmail)

  useEffect(() => {
    axios.get(`/api/board/${id}`)
      .then((res)=> {
        setData(res.data)
        // console.log(res.data)
      })
  }, [id]);

  return(
    <div id='BoardDetailPage' className='flex-col justify-center'>
      <Header/>
      <BoardDetailLayout data={data} mEmail={mEmail} page={page}/>
      <div id="board-bg" className='fixed top-0 left-0 h-dvh w-dvw -z-10'
           style={{ backgroundImage: `url(${bgimg})`}}
      ></div>
    </div>
  )
}
export default BoardDetailPage