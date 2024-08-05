import React, {useEffect, useState} from 'react';
import yFolderHover from "../../assets/community/b-folder.png"; // Mouse hover image
import yFolderClick from "../../assets/community/y-folder5.png"; // Clicked image
import yFolderInactive from "../../assets/community/w-folder.png"; // Inactive image
import { useNavigate } from "react-router-dom";

let noticeTuple = [
  { id: 1, title: '공지사항 제목1  123123', author: 'user1' },
  { id: 2, title: '공지사항 제목2  123123', author: 'user2' },
  { id: 3, title: '공지사항 제목3  123123', author: 'user3' },
  { id: 4, title: '공지사항 제목4  123123', author: 'user4' },
  { id: 5, title: '공지사항 제목5  123123', author: 'user5' },
];
let freeTuple = [
  { id: 1, title: '자유게시판 제목1  123123', author: 'user1' },
  { id: 2, title: '자유게시판 제목2  123123', author: 'user2' },
  { id: 3, title: '자유게시판 제목3  123123', author: 'user3' },
  { id: 4, title: '자유게시판 제목4  123123', author: 'user4' },
  { id: 5, title: '자유게시판 제목5  123123', author: 'user5' },
];
let faqTuple = [
  { id: 1, title: 'FAQ 제목1  123123', author: 'user1' },
  { id: 2, title: 'FAQ 제목2  123123', author: 'user2' },
  { id: 3, title: 'FAQ 제목3  123123', author: 'user3' },
  { id: 4, title: 'FAQ 제목4  123123', author: 'user4' },
  { id: 5, title: 'FAQ 제목5  123123', author: 'user5' },
];

const BoardTable = (props) => {
  const navi = useNavigate();
  const [activeTab, setActiveTab] = useState('notice');
  const [hoveredTab, setHoveredTab] = useState(null);

  const tuples = props.list;

  const onDetail = (index) => {
    navi(`/board/detail/${index}`);
  };

  const handleMouseEnter = (tab) => {
    setHoveredTab(tab);
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
  };

  const handleClick = (tab) => {
    setActiveTab(tab);
    document.getElementById('notice').style.width='160px';
    document.getElementById('free').style.width='160px';
    document.getElementById('faq').style.width='160px';
    document.getElementById(tab).style.width='180px';

  };

  const getBackgroundImage = (tab) => {
    if (activeTab === tab) return yFolderClick;
    if (hoveredTab === tab) return yFolderHover;
    return yFolderInactive;
  };

  return (
    <div id='BoardTable' className="flex justify-center">
      <div className='flex-col items-center justify-center'>
        <div className='flex'>
          <div
            id='notice'
            className="mt-4 ml-5 mr-3 pt-5 font-bold text-2xl content-center text-center nes-pointer"
            style={{
              width: '180px',
              height: '80px',
              backgroundImage: `url(${getBackgroundImage('notice')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onMouseEnter={() => handleMouseEnter('notice')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('notice')}
          >
            공지사항
          </div>
          <div
            id='free'
            className="mt-4 ml-2 mr-3 pt-5 font-bold text-2xl content-center text-center nes-pointer"
            style={{
              width: '160px',
              height: '80px',
              backgroundImage: `url(${getBackgroundImage('free')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onMouseEnter={() => handleMouseEnter('free')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('free')}
          >
            자유게시판
          </div>
          <div
            id='faq'
            className="mt-4 ml-2 mr-3 pt-5 text-3xl content-center text-center nes-pointer"
            style={{
              width: '160px',
              height: '80px',
              backgroundImage: `url(${getBackgroundImage('faq')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onMouseEnter={() => handleMouseEnter('faq')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('faq')}
          >
            FAQ
          </div>
        </div>
        <table className='nes-table is-bordered is-centered justify-center w-full'>
          <thead>
          <tr>
            <th style={{ width: '16px' }}>글번호</th>
            <th style={{ width: '70%' }}>제목</th>
            <th style={{ width: '40px' }}>글쓴이</th>
          </tr>
          </thead>
          <tbody>
          {tuples.map((tuple, index) => (
            <tr key={index}>
              <td className='text-center'>{tuple.bcId}</td>
              <td onClick={() => onDetail(tuple.bcId)}
                  style={{ padding: '10px 20px' }}
                  className='nes-pointer'
              >
                {tuple.title}
              </td>
              <td className='text-center'>{tuple.author}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardTable;