import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainGame from "./game/page/maingame/MainGame.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/game/:room_id" element={<MainGame />} />
    </Routes>
  </BrowserRouter>
);
