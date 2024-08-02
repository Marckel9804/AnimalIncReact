import {useNavigate, useParams} from "react-router-dom";
import BoardDetailLayout from "../layout/BoardDetailLayout.jsx";

let faqTuple = [
  { id: 1, title: 'FAQ 제목1  123123', code:'잡담', author: 'user1', content: '글1 내용 내용 <br/> 내용내용' , imgs:[], date:'2024-08-01' },
  { id: 2, title: 'FAQ 제목2  123123', code:'공략', author: 'user2', content: '글1 내용 내용 <br/> 내용내용' , imgs:[], date:'2024-08-01' },
  { id: 3, title: 'FAQ 제목3  123123', code:'정보', author: 'user3', content: '글1 내용 내용 <br/> 내용내용' , imgs:[], date:'2024-08-01' },
  { id: 4, title: 'FAQ 제목4  123123', code:'정보', author: 'user4', content: '글1 내용 내용 <br/> 내용내용' , imgs:[], date:'2024-08-01' },
  { id: 5, title: 'FAQ 제목5  123123', code:'잡담', author: 'user5', content: '글1 내용 내용 <br/> 내용내용' , imgs:[], date:'2024-08-01' },
];

const BoardDetailPage = () => {

  const params = useParams()

  const id = params.id;

  const info = faqTuple[id-1];

  return(
    <div id='BoardDetailPage' className='flex justify-center'>
      <BoardDetailLayout info={info} id={id}/>
    </div>
  )
}
export default BoardDetailPage