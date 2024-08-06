import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 추가
import backgroundImage from "../../../assets/background.jpg"; // 배경 이미지 경로 수정
import axios from 'axios';

// 전체 배경 컨테이너 스타일
const Container = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background-color: rgba(255, 255, 255, 0.8); /* 배경을 반투명하게 설정 */
  width: 100%;
`;

const MessageBalloon = styled.div`
  &.from-left,
  &.from-right {
    color: black; /* 메시지 색상을 검은색으로 설정 */
  }
`;

const MessageContainer = styled.section`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &.left {
    justify-content: flex-start;
  }

  &.right {
    justify-content: flex-end;
  }

  .nes-bcrikko {
    margin: 0 1rem;
  }
`;

const RoomWait = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReady, setIsReady] = useState(false); // 플레이어 1의 준비 상태를 관리하는 state 추가
  const [players, setPlayers] = useState([]); // 플레이어 데이터를 관리하는 state 추가
  const navigate = useNavigate();
  const socketRef = useRef(null); // useRef를 사용하여 WebSocket 객체 유지
  const clientId = useRef(uuidv4()); // 각 클라이언트를 고유하게 식별하는 clientId 생성

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = async (event) => {
      const text = await event.data.text();
      const parsedMessage = JSON.parse(text);
      setChatMessages((prevMessages) => [...prevMessages, parsedMessage]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    // 플레이어 데이터 가져오기
    axios.get("http://localhost:8080/api/user/players")
      .then(response => setPlayers(response.data.slice(0, 4))) // 최대 4명까지만 설정
      .catch(error => console.error('Error fetching player data:', error));
  }, []);

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = { sender: clientId.current, text: newMessage };
      socketRef.current.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

  const handleBackButtonClick = () => {
    navigate("/CreateRoom"); // 해당 경로로 이동
  };

  const handleReadyClick = () => {
    setIsReady(!isReady); // READY 버튼 클릭 시 상태를 토글
    if (!isReady) {
      setTimeout(() => {
        navigate(`/game/${uuidv4()}`); // 5초 뒤에 경로로 이동
      }, 5000);
    }
  };

  return (
    <Container>
      <Content className="bg-gray-200 p-8 min-h-screen">
        <div className="container mx-auto relative">
          <div className="flex justify-between mb-4">
            <button
              type="button"
              className="nes-btn is-primary"
              onClick={handleBackButtonClick}
            >
              뒤로가기
            </button>
            <button
              type="button"
              className={`nes-btn ${isReady ? 'is-warning' : 'is-success'}`}
              onClick={handleReadyClick} // READY 버튼 클릭 시 함수 호출
            >
              {isReady ? 'CANCEL' : 'READY'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <div key={index} className="nes-container is-rounded p-4">
                <div
                  style={{ backgroundColor: "#4CBDB8" }}
                  className="p-2 rounded text-white nes-text"
                >
                  {player.userNickname} {index === 0 && isReady && <span>(Ready)</span>} {/* 플레이어 1이 준비 상태일 때 Ready 표시 */}
                </div>
                <div className="bg-gray-100 p-4 rounded mt-2 nes-container">
                  <div className="flex items-center">
                    <img
                      src={`https://via.placeholder.com/150?text=유저이미지${index + 1}`}
                      alt={`유저이미지${index + 1}`}
                      className="rounded"
                    />
                    <div className="ml-4">
                      <p className="nes-text">{player.userGrade} {player.userPoint}P</p> {/* 등급과 포인트 표시 */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div
              style={{ backgroundColor: "#4CBDB8", height: "300px", overflowY: "scroll" }}
              className="nes-container is-rounded p-4 text-white"
            >
                <section className="message-list">
                  {chatMessages.map((message, index) => (
                    <MessageContainer key={index} className={message.sender === clientId.current ? 'right' : 'left'}>
                      {message.sender !== clientId.current && <i className="nes-bcrikko"></i>}
                      <MessageBalloon className={`nes-balloon ${message.sender === clientId.current ? 'from-right' : 'from-left'} nes-pointer`}>
                        <p>{message.text}</p>
                      </MessageBalloon>
                      {message.sender === clientId.current && <i className="nes-bcrikko"></i>}
                    </MessageContainer>
                  ))}
                </section>
            </div>
          </div>
          <div id="room-wait">
            <div className="mt-4 nes-field is-inline flex">
              <input
                type="text"
                id="inline_field"
                className="nes-input is-success flex-grow"
                placeholder="채팅 메시지를 입력하세요"
                value={newMessage}
                onChange={handleNewMessageChange}
              />
              <button
                type="button"
                className="nes-btn is-primary ml-2"
                onClick={handleSendMessage}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </Content>
    </Container>
  );
};

export default RoomWait;
