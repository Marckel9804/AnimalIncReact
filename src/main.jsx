import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainGame from "./game/page/maingame/MainGame.jsx";
import Login from "./login/Login.jsx";
import Register from "./login/Register.jsx";
import Ladder from "./game/page/minigame/Ladder.jsx";
import RoomList from "./game/page/rooms/RoomList.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/game/:room_id" element={<MainGame />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/createroom" element={<RoomList />} />
      <Route path="/ladder" element={<Ladder />} />
    </Routes>
  </BrowserRouter>
);
