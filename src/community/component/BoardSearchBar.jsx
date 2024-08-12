import {useState} from "react";

const BoardSearchBar = (props) => {

  const {type, setList} = props
  const [searchTitle, setSearchTitle] = useState('')

  const onChange = (e) => {
    if(e.key==='Enter') {
      onSearch(e.target.value)
    } else {
      setSearchTitle(e.target.value)
    }
  }

  const onSearch = (val) => {
    console.log('search content',val)
  }

  const onClick = () => {
    const val = document.getElementById('bsb-input').value
    onSearch(val)
  }

  return(
    <div className='flex gap-2 ml-1'>
      <input id='bsb-input'
             className='nes-input'
             onKeyUp={onChange}/>
      <button className='nes-btn'
              onClick={onClick}
              style={{width:'80px'}}>
        검색
      </button>
    </div>
  )
}

export default BoardSearchBar