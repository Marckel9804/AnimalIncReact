import {useLocation, useNavigate, useParams} from "react-router-dom";
import BoardListLayout from "../layout/BoardListLayout.jsx";
import '../Community.css'

const BoardListPage = () => {

  const params = useParams()
  const location = useLocation()
  const state = location.state || {type:'notice'};
  console.log("location",state)
  const page = params.page

  return (
    <div id='BoardListPage' className='mt-10 flex justify-center'>
      <BoardListLayout type={state.type} page={page}/>

    </div>
  )
}

export default BoardListPage