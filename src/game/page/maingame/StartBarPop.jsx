import React from "react";
import off from "../../.././images/off.png";
import thermo from "../../.././images/thermo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StartBarPop({ show, preventBlur, han }) {
  if (han == null || han[0][1].temp == "?") {
    return null;
  }

  return (
    <div className={`start-bar-pop-container ${show ? "flex" : "hidden"}`}>
      <div className="start-bar-group flex-col">
        {han.map((data) => (
          <div className="start-bar-pop-compoB" key={data[0]}>
            {data[0]}
            <p> </p> {data[1].TEMP}℃
          </div>
        ))}
        {/* {console.log("han", han)} */}
        <div className="start-bar-pop-compoB"></div>
        <div className="start-bar-pop-compoB"></div>
        <div className="start-bar-pop-compoB"></div>
      </div>
    </div>
  );
}
export default StartBarPop;
