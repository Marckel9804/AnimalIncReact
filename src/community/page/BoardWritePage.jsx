import {useNavigate} from "react-router-dom";
import BoardWriteLayout from "../layout/BoardWriteLayout.jsx";

const BoardWritePage = () => {

  const navi = useNavigate()

  return (
    <div id='BoardWritePage' className='flex mt-10 justify-center'>

      <BoardWriteLayout/>
    </div>
  )
}

export default BoardWritePage