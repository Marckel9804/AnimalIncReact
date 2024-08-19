import React from "react";
import ReactDOM from "react-dom";
import Rank_week from "./Rank_week";
import User_main from "./User_main";
import "./Main.css";
import Header from "../Header";
import Footer from "../Footer";

const Main = () => {
  return (
    <>
      <Header />
      <div className="main-container">
        <Rank_week />
        <User_main />
      </div>
      <div id="backImg" />
    </>
  );
};

export default Main;
