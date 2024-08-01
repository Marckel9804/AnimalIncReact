import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/main/Main";
import Store from "./components/store/Store";
import GachaShop from "./components/store/GachaShop";
import GachaResult from "./components/store/GachaResult";
import ItemShop from "./components/store/ItemShop";

import "nes.css/css/nes.min.css";
import "./App.css"; // App.css 파일을 임포트합니다.

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

  return <></>;
};

export default App;
