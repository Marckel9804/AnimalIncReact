import React, { useState } from "react";

function OtherPlayer({ show, setShow, otherStatus, formatNumber }) {
  return (
    <div className={"otherpinfo-container"}>
      <div className={` main-window ${show ? "flex" : "hidden"} `}>
        <div className="window-head">
          Other Players
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
          {/* <span className=" underline">F</span>ile
        <span className="ml-4 underline">E</span>dit
        <span className="ml-4 underline">V</span>iew
        <span className="ml-4 underline">H</span>elp */}
        </div>
        <div className="other-player-info flex-col justify-between p-4 flex-grow">
          {otherStatus.map((data) => (
            <div className=" border-2">
              <p style={{ fontSize: "19px", fontWeight: "bold" }}>
                {data.nickName}
              </p>
              <p>총 자산 : 000 ₩ </p>
              <span style={{ color: "red" }}>주식: 000 ₩</span>
              <br />
              <span style={{ color: "blue" }}>
                현금: {formatNumber(data.cash)} ₩
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OtherPlayer;
