import React, { useEffect, useState } from "react";
import off from "../../.././images/off.png";
import thermo from "../../.././images/thermo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StartBarPop from "./StartBarPop";

function StartBar({ show, preventBlur }) {
  const navigate = useNavigate();
  const [showSide, setShowSide] = useState(false);
  const [han, setHan] = useState([["안양천", { temp: "?" }]]);
  const hanriver = () => {
    axios.get("/hangang").then((res) => {
      setHan(Object.entries(res.data.DATAs.DATA.HANGANG));
      // console.log("한강", Object.entries(res.data.DATAs.DATA.HANGANG));
    });
  };

  useEffect(() => {
    hanriver();
  }, []);
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
        <div
          className="start-bar-compoB"
          onMouseEnter={() => {
            setShowSide(true);
          }}
          onMouseLeave={() => {
            setShowSide(false);
          }}
        >
          <img src={thermo} alt="off" width={35} />
          한강물 온도 보기 ▶
          <StartBarPop show={showSide} setShowSide={setShowSide} han={han} />
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
