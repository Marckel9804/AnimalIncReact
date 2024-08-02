import BoardTable from "../component/BoardTable.jsx";
import BoardPagenation from "../component/BoardPagenation.jsx";
import {useNavigate} from "react-router-dom";

const BoardListLayout = () => {

  const navi = useNavigate()

  const onWrite = () => {
    navi('/board/write')
  }

  return (
    <div id='BoardListLayout' className='flex flex-col justify-center w-11/12 '>

      <BoardTable/>
      <br/>
      <BoardPagenation/>
      <div id={'upHeaderbtn'} className='w-full flex justify-center'>

        <button id={"header-btn"} type={"button"}
                className='mt-5 nes-btn is-primary'
                style={{fontSize:'16px'}}
                onClick={onWrite}
        >
          글 작성하기
        </button>
      </ div>
      <div style={{backgroundColor:'aqua',zIndex:'-1', position:'fixed', width:'100vw', height:'100vh', top:'0px', left:'0px'}}></div>
    </div>
  )
}

export default BoardListLayout