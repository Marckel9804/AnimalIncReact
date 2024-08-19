import React, { useState } from "react";
import alert from "../../.././images/alert.png";

function Timer({ show, setShow, timer }) {
  const calculateRectangles = (value) => {
    return Math.min(Math.floor((value - 10) / 10) + 1, 18);
  };

  const rectangles = calculateRectangles(timer);

  return (
    <div className={`win-timer-container ${show ? "flex" : " invisible"}`}>
      <div className={`main-window flex`}>
        <div className="window-head">
          <p style={{ color: "white" }}>Timer</p>
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
        {/* {timer}/180 */}
        <div className="win-progress">
          {Array.from({ length: rectangles }).map((_, index) => (
            <div key={index} className="win-timer-rec"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timer;
