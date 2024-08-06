import BoardTable from "../component/BoardTable.jsx";
import BoardPagenation from "../component/BoardPagenation.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";

const BoardListLayout = (props) => {

  const navi = useNavigate()
  const [list, setList] = useState([])

  const page = props.page
  const tmp = props.type
  const role = props.role

  const [type, setType] = useState(tmp)

  const onWrite = () => {
    navi(`/board/write/${type}`)
  }

  useEffect(() => {
    axios.get('/api/board', {params: {type: type, page: page}})
      .then((res) => {
        // console.log(page)
        setList(res.data.content)
        // console.log(res.data.content)
      })

    if (type === 'notice') {
      if (role.indexOf('ADMIN') !== -1) {
        document.getElementById('write-btn').disabled = false;
      } else {
        document.getElementById('write-btn').disabled = true;
      }
    } else {
      if (role.indexOf('USER') !== -1) {
        document.getElementById('write-btn').disabled = false;
      } else {
        document.getElementById('write-btn').disabled = true;
      }
    }

  }, [type]);

  return (
    <div id='BoardListLayout' className='flex flex-col justify-center w-11/12 '>

      <BoardTable list={list} type={type} setType={setType}/>
      <br/>
      <BoardPagenation page={page}/>
      <div id={'upHeaderbtn'} className='w-full flex justify-center'>

        <button id={"write-btn"} type={"button"}
                className='mt-5 nes-btn is-primary'
                style={{fontSize: '16px'}}
                onClick={onWrite}
        >
          글 작성하기
        </button>
      </ div>
      <div style={{
        backgroundColor: 'aqua',
        zIndex: '-1',
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: '0px',
        left: '0px'
      }}></div>
    </div>
  )
}

export default BoardListLayout