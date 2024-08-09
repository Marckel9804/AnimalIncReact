import React, { useState } from "react";
import clock from "../../.././images/clock.ico";
import folder from "../../.././images/folder.ico";
import warning from "../../.././images/warning.ico";
import fake from "../../.././images/fake.ico";
import lottery from "../../.././images/lottery.ico";
import info from "../../.././images/info.ico";
function ItemsWin({ show, setShow }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className={"itemswin-container"}>
      <div className={`main-window ${show ? "flex" : "hidden"}`}>
        <div className="window-head">
          Items
          <div className=" ml-auto mr-1 flex items-center">
            <button
              className="window-head-btn items-end"
              onClick={() => {
                setShow(false);
              }}
            >
              _
            </button>
            <button className="window-head-btn-disabled items-center">
              ㅁ
            </button>
            <button className="window-head-btn-disabled items-center">x</button>
          </div>
        </div>
        <div className="window-head2">
          <span className=" underline">F</span>ile
          <span className="ml-4 underline">E</span>dit
          <span className="ml-4 underline">V</span>iew
          <span className="ml-4 underline">H</span>elp
        </div>
        <div className="main-window-inside win-item-icons pt-6">
          <div
            className="win-item-icon"
            onClick={() => {
              setSelected(1);
            }}
          >
            <img src={warning} style={{ width: "70px", height: "70px" }} />
            <div className={selected == 1 ? "win-item-text" : null}>공매도</div>
          </div>
          <div
            className="win-item-icon"
            onClick={() => {
              setSelected(2);
            }}
          >
            <img src={clock} style={{ width: "70px", height: "70px" }} />
            <div className={selected == 2 ? "win-item-text" : null}>
              타임머신
            </div>
          </div>
          <div
            className="win-item-icon"
            onClick={() => {
              setSelected(3);
            }}
          >
            <img src={fake} style={{ width: "70px", height: "70px" }} />
            <div className={selected == 3 ? "win-item-text" : null}>
              가짜 뉴스
            </div>
          </div>
          <div
            className="win-item-icon"
            onClick={() => {
              setSelected(4);
            }}
          >
            <img src={info} style={{ width: "70px", height: "70px" }} />
            <div className={selected == 4 ? "win-item-text" : null}>
              고급 정보
            </div>
          </div>
          <div
            className="win-item-icon"
            onClick={() => {
              setSelected(5);
            }}
          >
            <img src={lottery} style={{ width: "70px", height: "70px" }} />
            <div className={selected == 5 ? "win-item-text" : null}>로또</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemsWin;
