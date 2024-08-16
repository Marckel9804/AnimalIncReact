import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/Footer.jsx";

const BoardUpdateLayout = (props) => {
  const id = props.id;

  const navi = useNavigate();
  const [formData, setFormData] = useState({
    bcId: 0,
    type: '',
    bcCode: '',
    title: '',
    content: '',
    files: [],
    writeDate: '',
    userNum: 0,
  });

  useEffect(() => {
    axios.get(`/api/board/${id}`)
      .then((res) => {
        setFormData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const onUpdate = async () => {
    console.log('전송데이터', formData);
    try {
      const res = await axios.put(`/api/board`, formData);
      console.log('보낸 데이터', res.data);
      navi(`/board/detail/${res.data.bcId}`);
    } catch (err) {
      console.log('post formdata error', err);
    }
  };

  return (
    <div id='BoardUpdateLayout' className='flex justify-center mt-5 pb-40'>
      <div className='nes-container with-title bg-white w-4/5'>
        <p className='title' style={{lineHeight: '0.4', fontSize: '2rem'}}> 게시글 수정 </p>

        <div id='board-update-code-select'
             className='nes-field is-inline w-full'
             style={{marginTop: '40px', flexShrink: "0"}}>

          <div className='text-xl' style={{width: "128px", flexShrink: 0}}>∙태그</div>

          <div className="nes-select is-success">
            <select id='bcCode'
                    name='bcCode'
                    value={formData.bcCode}
                    onChange={onChange}>
              <option value="x" hidden>...</option>
              {
                formData.type==='notice'?(<>
                  <option value='이벤트'>이벤트</option>
                  <option value='공지'>공지</option>
                </>
              ):<></>
              }
              {
                formData.type==='free'?(<>
                    <option value="잡담">잡담</option>
                    <option value="공략">공략</option>
                    <option value="정보">정보</option>
                    <option value="질문">질문</option>
                  </>
                ):<></>
              }
              {
                formData.type==='faq'?(<>
                    <option value="건의사항">건의사항</option>
                    <option value="신고">신고</option>
                    <option value="버그">버그</option>
                  </>
                ):<></>
              }
            </select>
          </div>
        </div>

        <div className="nes-field is-inline my-5 w-full">
          <div className='text-xl w-32'>∙글 제목</div>
          <input type="text"
                 id="title"
                 className="nes-input is-success"
                 name='title'
                 value={formData.title}
                 onChange={onChange}
                 placeholder="글제목"/>
        </div>

        <div className="nes-field is-inline my-5 w-full">
          <div className='text-xl w-32'>∙글 내용</div>
          <textarea id="content"
                    rows={10}
                    className="nes-input is-success"
                    name='content'
                    value={formData.content}
                    onChange={onChange}
                    placeholder="글 내용"/>
        </div>

        <div className="nes-field is-inline my-5 w-full">
          <div className='text-xl w-32'>∙첨부파일</div>
          <input id='files'
                 type="file"
                 className="nes-input is-success"
                 onChange={(e) => setFormData({ ...formData, files: e.target.files })}
          />
        </div>

        <button className='nes-btn is-warning'
                onClick={onUpdate}
        >수정</button>
      </div>
      <Footer/>
    </div>
  );
};

export default BoardUpdateLayout;
