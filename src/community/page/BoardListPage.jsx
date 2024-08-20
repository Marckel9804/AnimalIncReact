import {useLocation, useNavigate, useParams} from "react-router-dom";
import BoardListLayout from "../layout/BoardListLayout.jsx";
import '../Community.css'
import {jwtDecode} from "jwt-decode";

const BoardListPage = () => {

  const params = useParams()
  const location = useLocation()
  const state = location.state || {type:'notice'};
  console.log("location",state)

  // URL에서 쿼리 파라미터로 페이지 값을 가져옴
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page') || '0';

  const token = localStorage.getItem('accessToken')
  const decodeToken = jwtDecode(token)
  const role = decodeToken.roleName;
  console.log('role ', role)

  return (
    <div id='BoardListPage' className=' flex justify-center'>
      <BoardListLayout role={role} type={state.type} page={page}/>

    </div>
  )
}

export default BoardListPage