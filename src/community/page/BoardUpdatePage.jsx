import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import BoardUpdateLayout from "../layout/BoardUpdateLayout.jsx";
import Header from "../../components/Header.jsx";



const BoardUpdatePage = () => {
  console.log("BoardUpdatePage component rendered");

  const params = useParams();
  const id = params.id;

  return (
    <div id='BoardUpdatePage' className='flex-col justify-center w-full'>
      <Header/>
      <BoardUpdateLayout id={id}/>
      <div id="board-bg" className='fixed top-0 left-0 h-dvh w-dvw bg-cyan-200 -z-10'></div>
    </div>
  )
}

export default BoardUpdatePage