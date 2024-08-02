import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ItemShop.css";
import itemImage from "../../assets/images/upward.jpg"; // 기존 이미지로 교체
import Footer from "../Footer";
import Header from "../Header";

const ItemShop = () => {
  const navigate = useNavigate();

  // 임시로 10개의 아이템 데이터 생성
  const items = Array.from({ length: 10 }, (_, index) => ({
    item_name: `아이템 ${index + 1}`,
    item_description: `이 아이템 ${index + 1}은 특별한 효과를 가지고 있습니다.`,
    item_image: itemImage,
    item_price: `${index + 1} 트로피`,
    item_category: `카테고리 ${index + 1}`,
  }));

  return (
    <>
      <Header />
      <div className="itemshop-container">
        <div className="itemshop-header">
          <Link to="/animal/encyclopediaapi" className="itemshop-link">
            도감
          </Link>
          <h2 className="itemshop-title">아이템 상점</h2>
          <span className="itemshop-close" onClick={() => navigate("/")}>
            X
          </span>
        </div>
        <div className="itemshop-main">
          <div className="itemshop-options">
            {items.map((item, index) => (
              <div key={index} className="itemshop-option">
                <div className="item-header">
                  <span className="itemshop-icon-text">{item.item_name}</span>
                  <span
                    className="itemshop-item-description-icon"
                    title={item.item_description}
                  >
                    !
                  </span>
                </div>
                <img
                  src={item.item_image}
                  alt={item.item_name}
                  className="itemshop-item-image"
                />
                <div className="itemshop-info">
                  <div className="itemshop-info-item">
                    <i className="nes-icon is-small is-transparent trophy"></i>
                    <span>{item.item_price}</span>
                  </div>
                  <div className="itemshop-info-item">
                    <i className="nes-icon is-small is-transparent heart"></i>
                    <span>{item.item_category}</span>
                  </div>
                </div>
                <button
                  className="nes-btn itemshop-btn"
                  onClick={() => navigate("/shop/item")}
                >
                  확인
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="backImg" />
      <Footer />
    </>
  );
};

export default ItemShop;
