import {useNavigate} from "react-router-dom";

const BoardDetailLayout = (props) => {

  const data = props.data;

  const navi = useNavigate()

  const onUpdate = () => {
    navi(`/board/update/${data.bcId}`)
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
            {data.userNum}
          </div>
          <a href="#" className="nes-badge">
            <span className="is-primary">{data.bcCode}</span>
          </a>
          <br/>
          <br/>
          <div className='mb-4'>
            {data.content}
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
          <div id='boardDetailBtns' className='pt-4 flex justify-center gap-3'>
            <button className='nes-btn is-warning' style={{color:'white'}}
                    onClick={onUpdate}
            >수정하기</button>
            <button className='nes-btn is-error'>삭제하기</button>
          </div>


        </div>
      </div>
    </div>
  )
}

export default BoardDetailLayout