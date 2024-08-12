import React, {useEffect, useState} from 'react';
import yFolderHover from "../../assets/community/b-folder.png"; // Mouse hover image
import yFolderClick from "../../assets/community/y-folder5.png"; // Clicked image
import yFolderInactive from "../../assets/community/w-folder.png"; // Inactive image
import { useNavigate } from "react-router-dom";


const BoardTable = (props) => {

  const {page,list,navi,type,setType} = props
  const [activeTab, setActiveTab] = useState(type);
  const [hoveredTab, setHoveredTab] = useState(null);


  const onDetail = (index) => {
    navi(`/board/detail/${index}?page=${page}`);
  };

  const handleMouseEnter = (tab) => {
    setHoveredTab(tab);
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
  };

  const handleClick = (tab) => {
    setActiveTab(tab);
    setType(tab);
    navi(`/board/list?page=${page}`,{state:{type:type}})
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
              width: activeTab==='notice'?'180px':'160px',
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
              width: activeTab==='free'?'180px':'160px',
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
              width: activeTab==='faq'?'180px':'160px',
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
          {list.map((item, index) => (
            <tr key={index}>
              <td className='text-center'>{item.bcId}</td>
              <td onClick={() => onDetail(item.bcId)}
                  style={{ padding: '10px 20px' }}
                  className='nes-pointer'
              >
                {item.title}
              </td>
              <td className='text-center'>{item.userEmail}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardTable;