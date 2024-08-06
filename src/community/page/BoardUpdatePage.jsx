import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import BoardUpdateLayout from "../layout/BoardUpdateLayout.jsx";



const BoardUpdatePage = () => {
  console.log("BoardUpdatePage component rendered");

  const params = useParams();
  const id = params.id;

  return (
    <div id='BoardUpdatePage' className='flex mt-10 justify-center'>
      <BoardUpdateLayout id={id}/>
    </div>
  )
}

export default BoardUpdatePage