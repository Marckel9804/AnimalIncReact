import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import { getUserInfo, logout, goToBoard, goToMypage, goToStore } from './api'
import axios from "../utils/axios.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { getUserInfo, logout, goToBoard, goToMypage, goToStore } from "./api";

const Header = () => {
  const [userInfo, setUserInfo] = useState({
    userNickname: "",
    userRuby: 0,
    userPoint: 0,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const data = await getUserInfo();
      setUserInfo({
        userNickname: data.user_nickname,
        userRuby: data.user_ruby,
        userPoint: data.user_point,
      });
    };
    fetchUserInfo();
  }, []);

  const logout = async () => {
    try {
      await axios.post('/api/user/logout');
      localStorage.removeItem('accessToken');
      window.location.href = '/'
    } catch (error) {
      console.error('Logout Error:', error);
      alert('로그아웃에 실패했습니다.');
    }
  }

  return (
    <header className="header-header-container">
      <div className="header-header-content">
        <div className="header-title">Animal 주식회사</div>
        <div className="header-user-info">
          <span className="header-user-name">{userInfo.userNickname}</span>
          <div className="header-ruby-info">
            <i className="nes-icon trophy header-ruby-icon" />
            <span className="header-ruby-text">{userInfo.userRuby}</span>
          </div>
          <div className="header-points-info">
            <i className="nes-icon coin header-points-icon" />
            <span className="header-points-text">{userInfo.userPoint}</span>
          </div>
          <div id="header-buttons" className="header-buttons">
            <button className="nes-btn is-board" onClick={goToBoard}>
              게시판
            </button>
            <button className="nes-btn is-mypage" onClick={goToMypage}>
              마이페이지
            </button>
            <button className="nes-btn is-store" onClick={goToStore}>
              상점
            </button>
            <button className="nes-btn is-logout" onClick={logout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
