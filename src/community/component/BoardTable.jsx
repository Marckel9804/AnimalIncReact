import yFolder from "../../assets/community/y-folder.png";
import {useNavigate} from "react-router-dom";

let noticeTuple = [
  {id: 1, title: '공지사항 제목1  123123', author: 'user1'},
  {id: 2, title: '공지사항 제목2  123123', author: 'user2'},
  {id: 3, title: '공지사항 제목3  123123', author: 'user3'},
  {id: 4, title: '공지사항 제목4  123123', author: 'user4'},
  {id: 5, title: '공지사항 제목5  123123', author: 'user5'},
]
let freeTuple = [
  {id: 1, title: '자유게시판 제목1  123123', author: 'user1'},
  {id: 2, title: '자유게시판 제목2  123123', author: 'user2'},
  {id: 3, title: '자유게시판 제목3  123123', author: 'user3'},
  {id: 4, title: '자유게시판 제목4  123123', author: 'user4'},
  {id: 5, title: '자유게시판 제목5  123123', author: 'user5'},
]
let faqTuple = [
  {id: 1, title: 'FAQ 제목1  123123', author: 'user1'},
  {id: 2, title: 'FAQ 제목2  123123', author: 'user2'},
  {id: 3, title: 'FAQ 제목3  123123', author: 'user3'},
  {id: 4, title: 'FAQ 제목4  123123', author: 'user4'},
  {id: 5, title: 'FAQ 제목5  123123', author: 'user5'},
]

const BoardTable = () => {

  const navi = useNavigate()

  const tuples = faqTuple;

  const onDetail = (index) => {
    navi(`/board/detail/${index}`)
  }

  return (
    <div id='BoardTable'>
      <div className='nes-table-responsive'>
        <div className='flex'>

          <div id='notice'
               className="mt-4 ml-2 mr-3 pt-5 text-center"
               style={{
                 width: '140px',
                 height: '50px',
                 backgroundImage: `url(${yFolder})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>공지사항
          </div>
          <div id='free'
               className="mt-4 ml-2 mr-3 pt-5 text-center"
               style={{
                 width: '140px',
                 height: '50px',
                 backgroundImage: `url(${yFolder})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>자유게시판
          </div>
          <div id='faq'
               className="mt-4 ml-2 mr-3 pt-5 text-center"
               style={{
                 width: '140px',
                 height: '50px',
                 backgroundImage: `url(${yFolder})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>FAQ
          </div>
        </div>
        <table className='nes-table is-bordered is-centered w-3/4'>
          <thead>
          <tr>
            <th className='w-12'>글번호</th>
            <th className='w-3/5'>제목</th>
            <th className='w-32'>글쓴이</th>
          </tr>
          </thead>
          <tbody>
          {tuples.map((tuple, index) => (
            <tr key={index}>
              <td className='text-center'>{tuple.id}</td>
              <td onClick={() => onDetail(tuple.id)} style={{padding: '10px 20px'}}>{tuple.title}</td>
              <td className='text-center'>{tuple.author}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BoardTable