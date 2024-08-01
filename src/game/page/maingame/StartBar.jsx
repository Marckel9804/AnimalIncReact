import React from "react";
import off from "../../.././images/off.png";
import thermo from "../../.././images/thermo.png";
import { useNavigate } from "react-router-dom";

function StartBar({ show, preventBlur }) {
  const navigate = useNavigate();

  return (
    <div className={`start-bar-container ${show ? "flex" : "hidden"}`}>
      <div className="start-bar-side">ANI, INC.</div>
      <div className="start-bar-group flex-col">
        <div className="start-bar-compoB"></div>
        <div className="start-bar-compoB"></div>
        <div className="start-bar-compoB"></div>
        <div className="start-bar-compoB"></div>
        <div className="start-bar-compoB"></div>
        <div className="start-bar-compoB"></div>
        <div className="start-bar-compoB">
          <img src={thermo} alt="off" width={35} />
          한강물 온도 보기 ▶
        </div>
        <div
          className="start-bar-compoB"
          onMouseDown={() => {
            navigate("/");
          }}
        >
          <img src={off} alt="off" width={35} />
          게임 종료하기
        </div>
      </div>
    </div>
  );
}
export default StartBar;
