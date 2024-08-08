import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import {useNavigate} from "react-router-dom";
import FileUploadTest from "../FileUploadTest.jsx";

let initData= {
  type:'',
  bcCode:'',
  title:'',
  content:'',
  files:[],
  writeDate:'',
  userEmail:'',
}

const BoardWriteLayout = (props) => {

  const [formData, setFormData] = useState(initData)

  const type = props.type
  const navi = useNavigate()
  const email = props.email

  console.log(email)

  useEffect(() => {
    formData['userEmail']=email;
    setFormData(formData);
  }, [email]);

  const onChange = (e) => {
    formData[e.target.name]=e.target.value
    setFormData(formData)
  }

  const onSubmit = async () => {

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${year}-${month}-${date} ${hours}:${minutes}`;

    formData['writeDate']=formattedTime
    formData['type']=type

    await setFormData(formData);
    await console.log('전송데이터', formData)
    await axios.post('/api/board/test/writedto',formData,{})
      .then((res)=> {
        // console.log('보낸 DTO',res.data)
        navi(`/board/detail/${res.data.bcId}`)
      })
      .catch((err)=>{console.log('post formdata error', err)})
  }

  const onCancel = () => {
    navi('/board/list/0')
  }

  return (
    <div id='BoardWriteLayout' className='justify-center w-8/12'>
      <div className='nes-container with-title'
      >
        <p className='title' style={{lineHeight: '0.4', fontSize: '2rem'}}> 자유게시글 작성 </p>

        {/* 태그 선택 */}
        <div id='board-write-code-select'
             className='nes-field is-inline w-full'
             style={{marginTop: '40px', flexShrink: "0"}}>

          <div className='text-xl'
               style={{width:"128px",flexShrink:0}} >∙태그</div>

          <div className="nes-select is-success" >
            <select name='bcCode'
                    onChange={onChange}>
              <option value="x" hidden>...</option>
              <option value="잡담">잡담</option>
              <option value="공략">공략</option>
              <option value="정보">정보</option>
              <option value="질문">질문</option>
            </select>
          </div>
        </div>

        {/* 인풋들 */}
        <div className="nes-field is-inline my-5 w-full">
          <div className='text-xl w-32'>∙글 제목</div>
          <input type="text" id="inline_field"
                 className="nes-input is-success"
                 name='title'
                 onChange={onChange}
                 placeholder="글제목"/>
        </div>
        <div className="nes-field is-inline my-5 w-full">
          <div className='text-xl w-32'>∙글 내용</div>
          <textarea id="inline_field"
                    rows={10}
                    className="nes-input is-success"
                    name='content'
                    onChange={onChange}
                    placeholder="글 내용"/>
        </div>
        <div className="nes-field is-inline my-5 w-full"

        >
          <div className='text-xl w-32'>∙첨부파일</div>
          <input type="file" id="inline_field" className="nes-input is-success"/>
        </div>

        <button className='nes-btn is-primary'
                onClick={onSubmit}
        >등록</button>
        <button className='nes-btn is-error'
                onClick={onCancel}>
          취소
        </button>

        <FileUploadTest/>

      </div>
    </div>
  )
}

export default BoardWriteLayout