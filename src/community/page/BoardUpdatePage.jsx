import {useNavigate, useParams} from "react-router-dom";
import BoardWriteLayout from "../layout/BoardWriteLayout.jsx";

const BoardUpdatePage = () => {

  const navi = useNavigate()

  const id = useParams();

  return (
    <div id='BoardUpdatePage' className='flex mt-10 justify-center'>
      <BoardWriteLayout/>
    </div>
  )
}

export default BoardUpdatePage