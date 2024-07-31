import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainGame from "./game/page/maingame/MainGame.jsx";
import Login from "./login/Login.jsx";
import Register from "./login/Register.jsx";
import BoardListPage from "./community/page/BoardListPage.jsx";
import BoardDetailPage from "./community/page/BoardDetailPage.jsx";
import BoardUpdatePage from "./community/page/BoardUpdatePage.jsx";

function BoardWritepage() {
    return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
        <Route path="/game/:room_id" element={<MainGame />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*게시판*/}
        <Route path='/board/list' element={<BoardListPage/>}/>
        <Route path='/board/write' element={<BoardWritepage/>}/>
        <Route path='/board/detail/:id' element={<BoardDetailPage/>}/>
        <Route path='/board/update/:id' element={<BoardUpdatePage/>}/>

    </Routes>
  </BrowserRouter>
);
