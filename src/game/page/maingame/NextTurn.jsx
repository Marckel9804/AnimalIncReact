import React, { useState } from "react";
import alert from "../../.././images/alert.png";

function NextTurn({ isOpen }) {
  return isOpen ? (
    <div className="win-next-background">
      <div className={"win-next-container"}>
        <div
          className={`main-window flex`}
          style={{
            paddingLeft: "1.5px",
            paddingRight: "1.5px",
            paddingTop: "2px",
          }}
        >
          <div className="window-head-blue">
            <p style={{ color: "white" }}>장 마감하는중....</p>
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <div
              style={{
                fontSize: "80px",
                textAlign: "center",
              }}
            >
              장 마감중....
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default NextTurn;
