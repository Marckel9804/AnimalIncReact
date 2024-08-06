import {useNavigate, useParams} from "react-router-dom";
import BoardDetailLayout from "../layout/BoardDetailLayout.jsx";
import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";



const BoardDetailPage = () => {

  const params = useParams()

  const id = params.id;
  const [data, setData] = useState({bcId:0,content:'',title:'',userNum:0,code:''});

  useEffect(() => {
    axios.get(`/api/board/${id}`)
      .then((res)=> {
        setData(res.data)
        // console.log(res.data)
      })
  }, [id]);

  return(
    <div id='BoardDetailPage' className='flex justify-center'>
      <BoardDetailLayout data={data}/>
    </div>
  )
}
export default BoardDetailPage