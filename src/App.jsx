import React, {useEffect} from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
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
      const response = await axios.post('/api/user/refresh-token');
      if (response.status === 200) {
        const newAccessToken = response.headers['authorization'].split(' ')[1];
        localStorage.setItem('access_token', newAccessToken);
      }
    } catch (error) {
      console.error('Error refreshing access token', error);
    }
  }

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
          <Route path="/naver/callback" element={<NaverCallback />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/google-login" element={<GoogleLoginPage/>} />
          <Route path="/kakao-login" element={<KakaoLogin/>} />
          <Route path="/check-profile" element={<CheckProfile/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
