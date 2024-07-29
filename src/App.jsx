// src/App.jsx

import React, { useState } from 'react';
import SpaceMinigame from './game/page/rooms/SpaceMinigame';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #4CBDB8;
`;

const EnterGameButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 1.5em;
  border: 2px solid #000;
  background-color: #fff;
  cursor: pointer;
  image-rendering: pixelated;
  border-radius: 10px;
`;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AppContainer>
        <button onClick={handleOpenModal} type="button" className="nes-btn is-primary">미니게임</button>
      {isModalOpen && <SpaceMinigame onClose={handleCloseModal} />}
    </AppContainer>
  );
}

export default App;
