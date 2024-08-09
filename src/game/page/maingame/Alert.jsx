import React, { useState } from "react";

function Alert({ isOpen, onClose, message }) {
  return isOpen ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>{message}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  ) : null;
}

export default Alert;
