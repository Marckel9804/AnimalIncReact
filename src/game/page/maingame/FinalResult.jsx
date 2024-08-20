import React, { useState } from "react";
import alert from "../../.././images/alert.png";
import { useNavigate } from "react-router-dom";

function FinalResult({ isOpen, onClose, result, formatNumber }) {
  const navigate = useNavigate();
  return isOpen ? (
    <div className="win-next-background ">
      <div className={"win-final-container"}>
        <div
          className={`main-window flex`}
          style={{
            paddingLeft: "1.5px",
            paddingRight: "1.5px",
            paddingTop: "2px",
          }}
        >
          <div className="window-head-blue">
            <p style={{ color: "white" }}>Game Result</p>
            <div className=" ml-auto mr-1 flex items-center">
              <button
                className="window-head-btn items-center"
                onClick={onClose}
              >
                x
              </button>
            </div>
          </div>
          <div className="p-24">
            {result.map((item) => (
              <div style={{ fontSize: "20px" }}>
                <span>
                  {item.rank}위 : {item.nickname} - {formatNumber(item.total)} ₩
                </span>
                <p>
                  <span style={{ color: "yellow" }}>
                    {" "}
                    +{(result.length - item.rank) * 10} Ruby
                  </span>
                  <span style={{ color: "blue" }}>
                    {" "}
                    +{(result.length - item.rank) * 10} Point
                  </span>
                </p>
                <br />
              </div>
            ))}
            <div className={`win-alert-btn w-52`}>
              <button
                onClick={() => {
                  navigate("/");
                }}
                className="win-alert-btn-in "
              >
                게임 종료하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default FinalResult;
