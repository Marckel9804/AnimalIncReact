import {useNavigate, useParams} from "react-router-dom";
import BoardListLayout from "../layout/BoardListLayout.jsx";
import '../Community.css'

const BoardListPage = () => {

  const navi = useNavigate()

  const params = useParams()
  const page = params.page

  return (
    <div id='BoardListPage' className='mt-10 flex justify-center'>
      <BoardListLayout page={page}/>

    </div>
  )
}

export default BoardListPage