const BoardPagenation = (props) => {
  const {page, setPage, totalPages,navi,type} = props

  const onPrev = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }
  const onNext = () => {
    if (page < totalPages - 1) {
      setPage(page + 1)
    }
  }
  const onWrite = () => {
    navi(`/board/write/${type}`)
  }

  return (
    <div>
      <div className="flex gap-1 justify-center my-4">
        <button className='nes-btn'
                onClick={() => onPrev()}>
          &lt;&lt; Prev
        </button>
        <button id={"write-btn"} type={"button"}
                className='nes-btn is-primary'
                style={{fontSize: '16px'}}
                onClick={onWrite}
        >
          글 작성하기
        </button>
        <button
          className='nes-btn'
          onClick={() => onNext()}>
          Next &gt;&gt;
        </button>
      </div>
      <div id={'upHeaderbtn'} className='w-full flex justify-center'>


      </ div>
    </div>
  )
}

export default BoardPagenation