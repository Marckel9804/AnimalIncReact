import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Store.css";
import Header from "../Header";
import Footer from "../Footer";

const Store = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="store-container">
        <div className="store-header">
          <Link to="/animal/encyclopediaapi" className="header-link">
            도감
          </Link>
          <h2 className="store-title">상점</h2>
          <span className="header-close" onClick={() => navigate("/")}>
            X
          </span>
        </div>
        <div className="store-main">
          <div className="store-options">
            <div className="option">
              <div className="icon-container">
                <span className="icon-text">가차샵</span>
                <i className="nes-pokeball animal-icon"></i>
              </div>
              <Link to="/shop/animal">
                <button className="nes-btn animal-btn">이동하기</button>
              </Link>
            </div>
            <div className="option">
              <div className="icon-container">
                <span className="icon-text">아이템샵</span>
                <i className="nes-kirby item-icon"></i>
              </div>
              <Link to="/shop/item">
                <button className="nes-btn item-btn">이동하기</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div id="backImg" />
      <Footer />
    </>
  );
};

export default Store;
