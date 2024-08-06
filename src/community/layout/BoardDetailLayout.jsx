import {useNavigate} from "react-router-dom";
import axios from "../../utils/axios.js";

const BoardDetailLayout = (props) => {

  const data = props.data;
  const reContent = data.content.split('\n')
  console.log(reContent)
  const mEmail = props.mEmail;

  const navi = useNavigate()

  const onUpdate = () => {
    navi(`/board/update/${data.bcId}`)
  }

  const onDelete = async () => {
    await axios.delete(`/api/board/${data.bcId}`)
    console.log('type',data.type)
    navi(`/board/list/0`,{state:{type:data.type}})
  }

  return(
    <div id='BoardDetailLayout' className='w-4/5 flex justify-center'>
      <div className='bg-emerald-400 w-full flex justify-center mt-20 py-10'>
        <div className="nes-container with-title w-10/12 min-h-80"
             style={{paddingLeft:'50px',paddingRight:'50px', backgroundColor:'white'}}
        >
          <p className="title"
             style={{text:'top', lineHeight:'0.75', fontSize:'30px'}}
          >{data.title}</p>
          <div className='float-right text-2xl'>
            {data.userEmail}
          </div>
          <a href="#" className="nes-badge">
            <span className="is-primary">{data.bcCode}</span>
          </a>
          <br/>
          <br/>
          <div className='mb-4'>
            {reContent.map((item, index) => (
              <div key={index}>
                {item}
                <br />
              </div>
            ))}
          </div>

          <div>
            <div className="nes-container with-title is-centered">
              <p className="title" style={{lineHeight:'0.7', fontSize:'25px'}}>첨부 이미지</p>
              <div id='boardDetailImgs' className='flex justify-center gap-3'>
                <div className='nes-bulbasaur'></div>
                <div className='nes-charmander'></div>
                <div className='nes-squirtle'></div>
              </div>
            </div>
          </div>

          {/* 수정/삭제 버튼들 */}
          {
            mEmail===data.userEmail?(
              <div id='boardDetailBtns' className='pt-4 flex justify-center gap-3'>
                <button className='nes-btn is-warning' style={{color:'white'}}
                        onClick={onUpdate}
                >수정하기</button>
                <button className='nes-btn is-error'
                        onClick={onDelete}
                >삭제하기</button>
              </div>
            ):('')
          }

        </div>
      </div>
    </div>
  )
}

export default BoardDetailLayout