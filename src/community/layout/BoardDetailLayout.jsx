import {useNavigate} from "react-router-dom";
import axios from "../../utils/axios.js";
import Footer from "../../components/Footer.jsx";

const BoardDetailLayout = (props) => {

  const {data, mEmail, page} = props
  const navi = useNavigate()
  const reContent = data.content.split('\n')

  const onUpdate = () => {
    navi(`/board/update/${data.bcId}`)
  }

  const onDelete = async () => {
    await axios.delete(`/api/board/${data.bcId}`)
    console.log('type', data.type)
    navi(`/board/list?page=${page}`, {state: {type: data.type}})
  }

  const onBack = () => {
    navi(`/board/list?page=${page}`, {state: {type: data.type}})
  }

  return (
    <div id='BoardDetailLayout' className='flex-col justify-center mt-5'>
      <div className='w-full flex justify-center pb-36'>
        <div className="nes-container with-title w-10/12 min-h-80"
             style={{paddingLeft: '50px', paddingRight: '50px', backgroundColor: 'white'}}
        >
          <p className='title'
             style={{lineHeight: '0.3', fontSize: '2rem', alignSelf: "center"}}>
            {data.title}
          </p>

          <div className='float-right text-2xl'>
            {data.userEmail}
          </div>
          <a href="#" className="nes-badge">
            <span className="is-primary">{data.bcCode}</span>
          </a>

          <br/><br/>

          <div className='mb-4'>
            {reContent.map((item, index) => (
              <div key={index}>
                {item}
                <br/>
              </div>
            ))}
          </div>

          <div>
            <div className="nes-container with-title is-centered">
              <p className="title"
                 style={{lineHeight: '0.7', fontSize: '25px'}}>
                첨부 이미지
              </p>
              <div className='grid grid-cols-3 justify-items-center items-center'>
                {data.files !== undefined ?
                  data.files.map((item, index) => (
                    <img key={index} src={`https://aniinc.kr.object.ncloudstorage.com/${item}`}
                         alt={`file-${index}`}/>
                  )) : ''}
              </div>
            </div>
          </div>


          {/* 수정/삭제 버튼들 */}
          {mEmail === data.userEmail ? (
            <div id='boardDetailBtns' className='pt-4 flex justify-center gap-3'>
              <button className='nes-btn is-warning'
                      style={{color: 'white'}}
                      onClick={onUpdate}>
                수정하기
              </button>
              <button className='nes-btn is-error'
                      onClick={onDelete}>
                삭제하기
              </button>
            </div>
          ) : ('')}

        </div>
      </div>
      {/*<button onClick={onBack}>리스트로 돌아가기</button>*/}

      <Footer/>
    </div>
  )
}

export default BoardDetailLayout