import React, { useEffect } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom'
import Main from './components/main/Main'
import Store from './components/store/Store'
import AnimalEncyclopedia from './components/store/AnimalEncyclopedia'
import GachaShop from './components/store/GachaShop'
import GachaResult from './components/store/GachaResult'
import ItemShop from './components/store/ItemShop'
import CheckoutPage from './components/payment/CheckoutPage' // 결제 페이지 컴포넌트 가져오기
import MainGame from './game/page/maingame/MainGame.jsx'
import Login from './login/Login.jsx'
import Register from './login/Register.jsx'
import Ladder from './game/page/minigame/Ladder.jsx'
import RoomList from './game/page/rooms/RoomList.jsx'
import NaverCallback from './login/NaverCallback.jsx'
import Mypage from './info/MyPage.jsx'
import Rank from './info/Rank.jsx'
import axios from './utils/axios.js'
import GoogleLoginPage from './login/GoogleLogin.jsx'
import KakaoLogin from './login/KakaoLogin.jsx'
import NaverLogin from './login/NaverLogin.jsx'
import CheckProfile from './login/CheckProfile.jsx'
import BoardListPage from './community/page/BoardListPage.jsx'
import BoardWritePage from './community/page/BoardWritePage.jsx'
import BoardDetailPage from './community/page/BoardDetailPage.jsx'
import BoardUpdatePage from './community/page/BoardUpdatePage.jsx' // App.css 파일을 임포트합니다.
import RoomWait from './game/page/rooms/RoomWait'
import SpaceMinigame from './game/page/rooms/SpaceMinigame'
import FindPassword from './login/FindPassword.jsx'
import Terms from './components/Terms'
import Privacy from './components/Privacy'
import './App.css'
import 'nes.css/css/nes.min.css'
import AdminPage from './admin/page/AdminPage.jsx'

const App = () => {
  const refreshAccessToken = async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const response = await axios.post('/api/user/refresh-token')
        const newAccessToken = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('accessToken', newAccessToken)
      } catch (err) {
        console.log('Error refreshing access token', err)
        localStorage.removeItem('accessToken')
        console.log('Tokens removed due to refresh error.')
      }
    }
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
          <Route path="/animal/encyclopedia" element={<AnimalEncyclopedia />} />
          <Route path="/shop/animal" element={<GachaShop />} />
          <Route path="/shop/animal-store/gacha" element={<GachaResult />} />
          <Route path="/shop/item" element={<ItemShop />} />
          <Route path="/createroom" element={<RoomList />} />
          <Route path="/ladder" element={<Ladder />} />
          <Route path="/payment" element={<CheckoutPage />} />
          <Route path="/naver/callback" element={<NaverCallback />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/google-login" element={<GoogleLoginPage />} />
          <Route path="/kakao-login" element={<KakaoLogin />} />
          <Route path="/check-profile" element={<CheckProfile />} />
          <Route path="/find-password" element={<FindPassword />} />

          {/* 게시판 페이지 */}
          <Route path="/board/list" element={<BoardListPage />} />
          <Route path="/board" element={<Navigate to="/board/list?page=0" />} />
          <Route path="/board/write/:type" element={<BoardWritePage />} />
          <Route path="/board/detail/:id" element={<BoardDetailPage />} />
          <Route path="/board/update/:id" element={<BoardUpdatePage />} />
          {/* 게시판 페이지 */}

          <Route exact path="/roomwait/:room_id" element={<RoomWait />} />
          <Route
            path="/game/page/rooms/SpaceMinigame"
            element={<SpaceMinigame />}
          />
          {/* 관리자 페이지 */}
          <Route path="/admin" element={<AdminPage />} />
          {/* 관리자 페이지 */}
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
