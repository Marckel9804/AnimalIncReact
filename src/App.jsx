import React, { useEffect } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Navigate, useNavigate,
} from "react-router-dom";
import Main from "./components/main/Main";
import Store from "./components/store/Store";
import AnimalEncyclopedia from "./components/store/AnimalEncyclopedia";
import GachaShop from "./components/store/GachaShop";
import GachaResult from "./components/store/GachaResult";
import ItemShop from "./components/store/ItemShop";
import CheckoutPage from "./components/payment/CheckoutPage"; // 결제 페이지 컴포넌트 가져오기
import MainGame from "./game/page/maingame/MainGame.jsx";
import Login from "./login/Login.jsx";
import Register from "./login/Register.jsx";
import Ladder from "./game/page/minigame/Ladder.jsx";
import RoomList from "./game/page/rooms/RoomList.jsx";
import NaverCallback from "./login/NaverCallback.jsx";
import Mypage from "./info/MyPage.jsx";
import Rank from "./info/Rank.jsx";
import axios from "./utils/axios.js";
import GoogleLoginPage from "./login/GoogleLogin.jsx";
import KakaoLogin from "./login/KakaoLogin.jsx";
import CheckProfile from "./login/CheckProfile.jsx";
import BoardListPage from "./community/page/BoardListPage.jsx";
import BoardWritePage from "./community/page/BoardWritePage.jsx";
import BoardDetailPage from "./community/page/BoardDetailPage.jsx";
import BoardUpdatePage from "./community/page/BoardUpdatePage.jsx"; // App.css 파일을 임포트합니다.
import RoomWait from "./game/page/rooms/RoomWait";
import SpaceMinigame from "./game/page/rooms/SpaceMinigame";
import FindPassword from "./login/FindPassword.jsx";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import "./App.css";
import "nes.css/css/nes.min.css";
import AdminPage from "./admin/page/AdminPage.jsx";
import SuccessPage from "./components/payment/SuccessPage.jsx";
import FailPage from "./components/payment/FailPage.jsx";

const App = () => {
  const refreshAccessToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (token && isTokeExpiringSoon(token)) {
      try {
        const response = await axios.post('/api/user/refresh-token');
        const newAccessToken = response.headers['authorization'].split(' ')[1];
        localStorage.removeItem('accessToken');
        localStorage.setItem('accessToken', newAccessToken);
      } catch (err) {
        console.log('Error refreshing access token', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
          alert('세션이 만료되어 자동으로 로그아웃되었습니다.');
          window.location.href = '/';
        }
      }
    }
  }

  function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
  }

  const isTokeExpiringSoon = (token) => {
    const decodedToken = decodeJWT(token);
    const currentTime = Date.now() / 1000;
    const tokenExpirationTime = decodedToken.exp;

    const timeLeft = tokenExpirationTime - currentTime;
    const threshold = 5 * 60;

    return timeLeft < threshold;
  }

  return (
    <Router>
      <div className="flex flex-col relative min-h-screen">
        <TokenRefresher refreshAccessToken={refreshAccessToken} />
        <Routes>
          <Route path="/game/:room_id" element={<MainGame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Main />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/shop" element={<Store />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/fail" element={<FailPage />} />
          <Route path="/animal/encyclopedia" element={<AnimalEncyclopedia />} />
          <Route path="/shop/animal" element={<GachaShop />} />
          <Route path="/shop/animal-store/gacha" element={<GachaResult />} />
          <Route path="/shop/item" element={<ItemShop />} />
          <Route path="/createroom" element={<RoomList />} />
          <Route path="/ladder/:room_id" element={<Ladder />} />
          {/*태웅 경로 */}
          <Route path="/payment" element={<CheckoutPage />} />
          <Route path="/naver/callback" element={<NaverCallback />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/google-login" element={<GoogleLoginPage />} />
          <Route path="/kakao-login" element={<KakaoLogin />} />
          <Route path="/check-profile" element={<CheckProfile />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/board/list" element={<BoardListPage />} />
          <Route path="/board" element={<Navigate to="/board/list?page=0" />} />
          <Route path="/board/write/:type" element={<BoardWritePage />} />
          <Route path="/board/detail/:id" element={<BoardDetailPage />} />
          <Route path="/board/update/:id" element={<BoardUpdatePage />} />
          <Route exact path="/roomwait/:room_id" element={<RoomWait />} />
          <Route path="/SpaceMinigame" element={<SpaceMinigame />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  )
}

const TokenRefresher = ({ refreshAccessToken }) => {
  const location = useLocation()

  useEffect(() => {
    refreshAccessToken()
  }, [location])

  return null
}

export default App
