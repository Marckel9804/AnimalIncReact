import {useNavigate} from "react-router-dom";
import BoardListLayout from "../layout/BoardListLayout.jsx";
import '../Community.css'

const BoardListPage = () => {

  const navi = useNavigate()

  return (
    <div id='BoardListPage' className='mt-10 flex justify-center'>
      <BoardListLayout/>

    </div>
  )
}

export default BoardListPage