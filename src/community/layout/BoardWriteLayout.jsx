const BoardWriteLayout = () => {
  return (
    <div id='BoardWriteLayout' className='justify-center w-8/12'>
      <div className='nes-container with-title justify-center'>
        <p className='title' style={{lineHeight: '0.4', fontSize: '2rem'}}> 자유게시글 작성 </p>

        {/* 태그 선택 */}
        <div id='board-write-code-select' className='flex w-4/5 justify-center' style={{marginTop: '40px'}}>
          <div className='text-xl self-center' style={{width:'128px'}}>∙태그</div>
          <div className="nes-select is-success" style={{width:'100%-128px'}}>
            <select>
              <option value="x" hidden>...</option>
              <option value="잡담">잡담</option>
              <option value="공략">공략</option>
              <option value="정보">정보</option>
              <option value="질문">질문</option>
            </select>
          </div>
        </div>

        {/* 인풋들 */}
        <div className="nes-field is-inline my-5 w-4/5">
          <div className='text-xl w-32'>∙글 제목</div>
          <input type="text" id="inline_field" className="nes-input is-success" placeholder="글제목"/>
        </div>
        <div className="nes-field is-inline my-5 w-4/5">
          <div className='text-xl w-32'>∙글 내용</div>
          <textarea id="inline_field" rows={10} className="nes-input is-success" placeholder="글 내용"/>
        </div>
        <div className="nes-field is-inline my-5 w-4/5"

        >
          <div className='text-xl w-32'>∙첨부파일</div>
          <input type="file" id="inline_field" className="nes-input is-success"/>
        </div>


      </div>
    </div>
  )
}

export default BoardWriteLayout