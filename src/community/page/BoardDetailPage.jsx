import {useLocation, useNavigate, useParams} from "react-router-dom";
import BoardDetailLayout from "../layout/BoardDetailLayout.jsx";
import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import {jwtDecode} from "jwt-decode";



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
    <div id='BoardDetailPage' className='flex justify-center'>
      <BoardDetailLayout data={data} mEmail={mEmail} page={page}/>
    </div>
  )
}
export default BoardDetailPage