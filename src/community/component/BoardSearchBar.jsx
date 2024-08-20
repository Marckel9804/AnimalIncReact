import {useState} from "react";
import axios from "../../utils/axios.js";

const BoardSearchBar = (props) => {

  const {type, tag, setTag, setList} = props

  const [searchTitle, setSearchTitle] = useState('')

  const onChange = (e) => {
    if(e.key==='Enter') {
      onSearch()
    } else {
      setSearchTitle(e.target.value)
    }
  }

  const onSearch = async () => {
    console.log('search content',searchTitle)
    console.log('search tag',tag)

     await axios.get(`/api/board/search`,{params: {title:searchTitle,tag:tag,type:type,}})
       .then((res)=> {
         console.log(res.data)
         setList(res.data.content)
       })
       .catch((err)=> {
         console.log("get Search ERROR!!",err)
       })
  }

  const onClick = () => {
    const val = document.getElementById('bsb-input').value
    onSearch(val)
  }

  const onTag = (e) => {
    setTag(e.target.value)
  }

  return(
    <div className='flex gap-2 ml-1'>

      <input id='bsb-input'
             className='nes-input'
             onKeyUp={onChange}/>

      <div className="nes-select is-warning w-32">
        <select name='tag'
                value={tag}
                onChange={onTag}
        >
          <option value='all' hidden>...</option>
          {type==='notice'?(<>
              <option value='이벤트'>이벤트</option>
              <option value='공지'>공지</option>
            </>
          ):<></>
          }
          {
            type==='free'?(<>
                <option value="잡담">잡담</option>
                <option value="공략">공략</option>
                <option value="정보">정보</option>
                <option value="질문">질문</option>
              </>
            ):<></>
          }
          {
            type==='faq'?(<>
                <option value="건의사항">건의사항</option>
                <option value="신고">신고</option>
                <option value="버그">버그</option>
              </>
            ):<></>
          }
        </select>
      </div>

      <button className='nes-btn'
              onClick={onClick}
              style={{width: '80px'}}>
        검색
      </button>
    </div>
  )
}

export default BoardSearchBar