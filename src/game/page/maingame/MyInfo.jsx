import React, { useState } from "react";

function MyInfo({ show, setShow, getUserInfo }) {
  const [chartStatus, setChartStatus] = useState(true);
  const toggleChart = () => {
    if (chartStatus) {
      setChartStatus(false);
    } else {
      setChartStatus(true);
    }
  };
  return (
    <div className={"myinfo-container"}>
      <div className={`main-window ${show ? "flex" : "hidden"}`}>
        <div className="window-head">
          My Info
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
          <span className=" underline" onClick={getUserInfo}>
            F
          </span>
          ile
          <span className="ml-4 underline">E</span>dit
          <span className="ml-4 underline">V</span>iew
          <span className="ml-4 underline">H</span>elp
        </div>
        <div className="main-window-inside flex flex-col">
          <div>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>총 자산 :</p>
            000₩ (<span style={{ color: "red" }}>주식: 000₩</span> +{" "}
            <span style={{ color: "blue" }}>현금: 000₩</span>)
          </div>
          <div className="nes-container with-title mt-4 mb-4 flex-grow select-none">
            <p className="title" style={{ lineHeight: "0.5" }}>
              {chartStatus ? "보유 주식" : "거래 내역"}{" "}
              <span onClick={toggleChart}>▶</span>
            </p>
            <div className=" w-1/4 ml-auto">
              <select>
                <option>7/21</option>
                <option>7/22</option>
                <option>7/23</option>
                <option>7/24</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
