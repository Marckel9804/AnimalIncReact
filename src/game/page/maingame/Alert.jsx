import React, { useState } from "react";
import alert from "../../.././images/alert.png";

function Alert({ isOpen, onClose, message }) {
  const [isClicked, setIsClicked] = useState(false);
  return isOpen ? (
    <div className={"win-alert-container"}>
      <div
        className={`main-window flex`}
        style={{
          paddingLeft: "1.5px",
          paddingRight: "1.5px",
          paddingTop: "2px",
        }}
      >
        <div className="window-head-blue">
          <p style={{ color: "white" }}>Alert</p>
          <div className=" ml-auto mr-1 flex items-center">
            <button className="window-head-btn items-center" onClick={onClose}>
              x
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <img src={alert} width={100} height={100} />
          <div className=" ml-5">{message}</div>
        </div>
        <div className={`win-alert-btn `}>
          <button onClick={onClose} className="win-alert-btn-in ">
            닫기
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default Alert;
