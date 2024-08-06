<<<<<<< HEAD
import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
=======
import React, {useEffect} from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
>>>>>>> dev
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
import NaverCallback from "./login/NaverCallback.jsx";

import "nes.css/css/nes.min.css";
import "./App.css";
import Mypage from "./info/MyPage.jsx";
import Rank from "./info/Rank.jsx";
import axios from "./utils/axios.js";
import GoogleLoginPage from "./login/GoogleLogin.jsx";
import KakaoLogin from "./login/KakaoLogin.jsx";
import NaverLogin from "./login/NaverLogin.jsx";
import CheckProfile from "./login/CheckProfile.jsx";
import BoardListPage from "./community/page/BoardListPage.jsx";
import BoardWritePage from "./community/page/BoardWritePage.jsx";
import BoardDetailPage from "./community/page/BoardDetailPage.jsx";
import BoardUpdatePage from "./community/page/BoardUpdatePage.jsx"; // App.css 파일을 임포트합니다.
import RoomWait from "./game/page/rooms/RoomWait";
import SpaceMinigame from "./game/page/rooms/SpaceMinigame";

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

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("/api/user/refresh-token");
      if (response.status === 200) {
        const newAccessToken = response.headers["authorization"].split(" ")[1];
        localStorage.setItem("access_token", newAccessToken);
      }
    } catch (error) {
      console.error("Error refreshing access token", error);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

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
<<<<<<< HEAD
          <Route path="/naver/callback" element={<NaverCallback />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/google-login" element={<GoogleLoginPage />} />
          <Route path="/kakao-login" element={<KakaoLogin />} />
          <Route path="/check-profile" element={<CheckProfile />} />
          {/*게시판*/}
          <Route path="/board/list" element={<BoardListPage />} />
          <Route path="/board/write" element={<BoardWritePage />} />
          <Route path="/board/detail/:id" element={<BoardDetailPage />} />
          <Route path="/board/update/:id" element={<BoardUpdatePage />} />
=======

          {/*태웅 경로 */}
          <Route path="/naver/callback" element={<NaverCallback />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/google-login" element={<GoogleLoginPage/>} />
          <Route path="/kakao-login" element={<KakaoLogin/>} />
          <Route path="/check-profile" element={<CheckProfile/>} />
          <Route path="/find-password" element={<FindPassword />} />

          {/* 게시판 시작 */}
          <Route path='/board/list/:page' element={<BoardListPage/>}/>
          <Route path='/board' element={<Navigate to="/board/list/0" />}/>
          <Route path='/board/write/:type' element={<BoardWritePage/>}/>
          <Route path='/board/detail/:id' element={<BoardDetailPage/>}/>
          <Route path='/board/update/:id' element={<BoardUpdatePage/>}/>
          {/* 게시판 끝 */}

>>>>>>> dev
          {/* 태경 경로 */}
          {/* <Route exact path="/" element={<RoomWait />} /> */}
          <Route
            exact
            path="/game/page/rooms/RoomWait"
            element={<RoomWait />}
          />
          <Route
            path="/game/page/rooms/SpaceMinigame"
            element={<SpaceMinigame />}
          />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
