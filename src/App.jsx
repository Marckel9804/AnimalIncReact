import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation, Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/main/Main";
import Store from "./components/store/Store";
import GachaShop from "./components/store/GachaShop";
import GachaResult from "./components/store/GachaResult";
import ItemShop from "./components/store/ItemShop";
import MainGame from "./game/page/maingame/MainGame.jsx";
import Login from "./login/Login.jsx";
import Register from "./login/Register.jsx";
import Ladder from "./game/page/minigame/Ladder.jsx";
import RoomList from "./game/page/rooms/RoomList.jsx";

import "nes.css/css/nes.min.css";
import "./App.css";
import BoardListPage from "./community/page/BoardListPage.jsx";
import BoardWritePage from "./community/page/BoardWritePage.jsx";
import BoardDetailPage from "./community/page/BoardDetailPage.jsx";
import BoardUpdatePage from "./community/page/BoardUpdatePage.jsx"; // App.css 파일을 임포트합니다.

const App = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    position: "relative", // 배경 투명도
  };

  const contentStyle = {
    flex: 1,
  };

  return (
    <Router>
      <div className="flex flex-col relative min-h-screen">
        <Routes>
          <Route path="/game/:room_id" element={<MainGame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Main />} />
          <Route path="/shop" element={<Store />} />
          <Route path="/shop/animal" element={<GachaShop />} />
          <Route
            path="/shop/animal-store/gacha"
            element={<GachaResult />}
          />{" "}
          {/* GachaResult 경로를 추가합니다 */}
          <Route path="/shop/item" element={<ItemShop />} />{" "}
          {/* ItemShop 경로를 추가합니다 */}
          <Route path="/createroom" element={<RoomList />} />
          <Route path="/ladder" element={<Ladder />} />

          {/* 게시판 시작 */}
          <Route path='/board/list/:page' element={<BoardListPage/>}/>
          <Route path='/board' element={<Navigate to="/board/list/0" />}/>
          <Route path='/board/write/:type' element={<BoardWritePage/>}/>
          <Route path='/board/detail/:id' element={<BoardDetailPage/>}/>
          <Route path='/board/update/:id' element={<BoardUpdatePage/>}/>
          {/* 게시판 끝 */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;
