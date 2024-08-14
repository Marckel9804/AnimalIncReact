import React, { useState } from "react";
import ShortSelling from "./ShortSelling";
import TimeMachine from "./TimeMachine";
import GoodNews from "./GoodNews";
import Lottery from "./Lottery";
import FakeNews from "./FakeNews";

function ItemUse({
  isOpen,
  onClose,
  item,
  stockInfo,
  formatNumber,
  myStatus,
  setMyStatus,
  openAlert,
  companyName,
  gameStatus,
}) {
  const title = {
    shortSelling: "공매도",
    timeMachine: "타임머신",
    fakeNews: "가짜 뉴스",
    goodNews: "고급 정보",
    lottery: "로또",
  };
  const props = {
    stockInfo,
    formatNumber,
    myStatus,
    setMyStatus,
    openAlert,
    onclose,
    companyName,
    gameStatus,
  };

  return isOpen ? (
    <div className={"win-item-use-container"}>
      <div className={`main-window flex`}>
        <div className="window-head-blue">
          <p style={{ color: "white" }}>{title[item]}</p>
          <div className=" ml-auto mr-1 flex items-center">
            <button className="window-head-btn items-center" onClick={onClose}>
              x
            </button>
          </div>
        </div>
        <div className=" flex-grow">
          {item === "shortSelling" ? <ShortSelling {...props} /> : null}
          {item === "timeMachine" ? <TimeMachine {...props} /> : null}
          {item === "fakeNews" ? <FakeNews {...props} /> : null}
          {item === "goodNews" ? <GoodNews {...props} /> : null}
          {item === "lottery" ? <Lottery {...props} /> : null}
        </div>
        <div className={`win-alert-btn mb-4`}>
          <button onClick={onClose} className="win-alert-btn-in ">
            닫기
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default ItemUse;
