import BoardTable from "../component/BoardTable.jsx";
import BoardPagenation from "../component/BoardPagenation.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import BoardSearchBar from "../component/BoardSearchBar.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import bgimg from "../../image/background.png";

const BoardListLayout = (props) => {

  const navi = useNavigate()
  const role = props.role

  const [type, setType] = useState(props.type)
  const [tag, setTag] = useState('all');
  const [list, setList] = useState([])
  const [page, setPage] = useState(props.page)
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios.get('/api/board', {params: {type: type, page: page}})
      .then((res) => {
        setList(res.data.content)
        setTotalPages(res.data.totalPages)
        console.log(res.data)
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

  useEffect(() => {
    axios.get('/api/board', {params: {type: type, page: page}})
      .then((res) => {
        setList(res.data.content)
        setTotalPages(res.data.totalPages)
      })
  }, [page]);

  return (
    <div id='BoardListLayout'>

      <Header/>

      <div className='flex justify-center'>

        <div className='flex flex-col justify-center w-11/12 pb-40'>

          <BoardTable page={page}
                      navi={navi}
                      list={list}
                      type={type}
                      setType={setType}/>
          <br/>
          <BoardSearchBar type={type}
                          tag={tag}
                          setTag={setTag}
                          setList={setList}/>

          <BoardPagenation page={page}
                           setPage={setPage}
                           totalPages={totalPages}
                           navi={navi}
                           type={type}/>


          <div style={{
            backgroundImage: `url(${bgimg})`,
            zIndex: '-1',
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: '0px',
            left: '0px'
          }}></div>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default BoardListLayout