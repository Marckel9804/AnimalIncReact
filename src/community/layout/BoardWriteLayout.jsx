import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import {useNavigate} from "react-router-dom";
import FileUploadTest from "../FileUploadTest.jsx";
import WriteFileItem from "../component/WriteFileItem.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";

let initData = {
  type: '',
  bcCode: '',
  title: '',
  content: '',
  files: [],
  writeDate: '',
  userEmail: '',
}

const BoardWriteLayout = (props) => {

  const [formData, setFormData] = useState(initData)
  const [files, setFiles] = useState([]);

  const type = props.type
  const navi = useNavigate()
  const email = props.email

  useEffect(() => {
    formData['userEmail'] = email;
    setFormData(formData);
  }, [email]);

  const onChange = (e) => {
    formData[e.target.name] = e.target.value
    setFormData(formData)
  }

  const onSubmit = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedTime = `${year}-${month}-${date} ${hours}:${minutes}`;

      formData['writeDate'] = formattedTime;
      formData['type'] = type;

      await onUpload();
      console.log('전송데이터', formData);

      const res = await axios.post('/api/board/test/writedto', formData, {});
      navi(`/board/detail/${res.data.bcId}`);
    } catch (err) {
      console.log('post formdata error', err);
    }
  };

  const onUpload = async () => {
    const fileData = new FormData();
    console.log(files);
    files.forEach((file) => {
      fileData.append('files', file);
    });
    fileData.append('folderName', 'images');
    console.log('img upload', fileData);

    try {
      const res = await axios.post('/api/upload/imglist', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('data', res);
      const tmp = res.data.map((item) => item.upLoadFilename);
      formData['files'] = tmp;
      await setFormData(formData);
    } catch (err) {
      console.log('upload error', err);
    }
  };

  const onCancel = () => {
    navi(`/board/list?page=0`,{state:{type:type}})
  }

  const addFile = (event) => {
    setFiles([...files, event.target.files[0]]);
    console.log(files)
  };

  const deleteFile = async (index) => {
    setFiles(prevFiles => prevFiles.filter((item, i) => i !== index));
  }

  return (
    <div id='BoardWriteLayout' className=' flex mt-5 pb-40 justify-center w-full'>
      <div className='nes-container with-title bg-white mb-4 w-4/5'
           // style={{width:"1200px"}}
      >
        <p className='title' style={{lineHeight: '0.4', fontSize: '2rem'}}>
          {type==='notice'?'공지사항 작성':''}
          {type==='free'?'자유게시글 작성':''}
          {type==='faq'?"FAQ 작성":''}
        </p>

        {/* 태그 선택 */}
        <div id='board-write-code-select'
             className='nes-field is-inline w-full'
             style={{marginTop: '40px', flexShrink: "0"}}>

          <div className='text-xl'
               style={{width: "128px", flexShrink: 0}}>∙태그
          </div>

          <div className="nes-select is-success">
            <select name='bcCode'
                    onChange={onChange}>
              <option value="x" hidden>...</option>

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
        <div className="nes-field is-inline my-5 w-full">
          <div className='text-xl w-32'>∙첨부파일</div>
          <input type="file"
                 id="write-input-file"
                 className="nes-input is-success"
                 onChange={addFile}
          />
        </div>

        <div className='grid grid-cols-2 py-4'>

          {files.map((item, index) => (
            <WriteFileItem
              key={index}
              index={index}
              fileName={item.name}
              file={item}
              deleteFile={deleteFile}
            />
          ))}
        </div>

        <div id='board-write-fbtns'
             className='flex gap-3 justify-center'>

          <button className='nes-btn is-primary'
                  style={{width: '100px'}}
                  onClick={onSubmit}
          >등록
          </button>
          <button className='nes-btn is-error'
                  style={{width:'100px'}}
                  onClick={onCancel}>
            취소
          </button>

        </div>
      </div>
        <Footer/>
    </div>
  )
}

export default BoardWriteLayout