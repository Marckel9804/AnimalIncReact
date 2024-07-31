import {useNavigate} from "react-router-dom";
import yFolder from '../../assets/community/y-folder.png'
import BoardListLayout from "../layout/BoardListLayout.jsx";

const BoardListPage = () => {

  const navi = useNavigate()

  return (
    <div id='BoardListPage'>
      <button className='nes-btn'>hihi</button>
      <BoardListLayout/>

    </div>
  )
}

export default BoardListPage