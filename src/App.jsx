import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoomWait from './game/page/rooms/RoomWait';
import SpaceMinigame from './game/page/rooms/SpaceMinigame';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<RoomWait />} />
        <Route exact path="/game/page/rooms/RoomWait" element={<RoomWait />} />
        <Route path="/game/page/rooms/SpaceMinigame" element={<SpaceMinigame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
