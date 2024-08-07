import { useRef, useState } from "react";
import axios from "../../../utils/axios.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const CreateRoom = (props) => {
  const navigate = useNavigate();

  // 유저 정보 받기
  const user = props.user[0];
  console.log("유저 정보 확인: ", props.user[0]);
  // roomId 생성
  const nowTime = moment().format("YYMMDDHHMM");
  const roomId = `${nowTime}_R_${user.userNum}`;
  console.log("방 번호 확인: ", roomId);

  // 방 만들기 컴포넌트 띄우면 NES 캐릭터들 랜덤으로 뜨게 만듬
  const randomRef = useRef([
    "nes-mario",
    "nes-ash",
    "nes-pokeball",
    "nes-bulbasaur",
    "nes-charmander",
    "nes-squirtle",
    "nes-kirby",
  ]);
  let randomChar = Math.floor(Math.random() * 7);

  // 유저가 생성하는 방 정보 저장 및 유효성 검사
  const roomRef = useRef([]);
  console.log("방 정보: ", roomRef);

  const getRoomInfo = () => {
    console.log(roomRef);
    if (roomRef.current[0] === undefined) {
      alert("방 제목을 입력해주세요");
      document.getElementById("name_field").focus();
      return false;
    }
    if (roomRef.current[1] === undefined) {
      alert("채널을 선택해주세요");
      return false;
    }
    if (roomRef.current[2] === undefined) {
      alert("인원 수를 선택해주세요");
      return false;
    }
    insertRoom();
  };

  // 방 생성하기
  const insertRoom = async () => {
    await axios
      .post(`/api/user/game/insertRoom`, {
        gameRoomId: roomId,
        roomName: roomRef.current[0],
        tier: roomRef.current[1],
        players: roomRef.current[2],
      })
      .then(() => {
        alert("📢➰ 게임 방이 만들어졌어요.");
        navigate(`/roomwait/${roomId}`, { state: { roomId: roomId, roomName: roomRef.current[0], maxPlayers: roomRef.current[2] } });
      })
      .catch((error) => {
        alert("😢 문제가 생겼어요... 관리자에게 문의해주세요.");
        console.log(error);
      });
  };

  return (
    <div className="nes-container is-rounded">
      <section className="icon-list text-center">
        <i className={randomRef.current[randomChar]}></i>
      </section>
      <div className="nes-container with-title is-centered m-5">
        <p className="title">방 만들기</p>
        <div className="nes-container with-title is-rounded">
          <p className="title">방 제목</p>
          <input
            type="text"
            id="name_field"
            className="nes-input"
            placeholder="방 제목을 입력하세요."
            onChange={(e) => {
              roomRef.current[0] = e.target.value;
            }}
          />
        </div>
        <div className="nes-container with-title is-rounded">
          <p className="title">채널 선택</p>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="channel"
              value="free"
              onClick={(e) => {
                roomRef.current[1] = e.target.value;
              }}
            />
            <span>자유</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="channel"
              value="gold"
              onClick={(e) => {
                roomRef.current[1] = e.target.value;
              }}
            />
            <span>골드</span>
          </label>
        </div>
        <div className="nes-container with-title is-rounded">
          <p className="title">인원 선택</p>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="player"
              onClick={() => {
                roomRef.current[2] = 1;
              }}
            />
            <span>1인</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="player"
              onClick={() => {
                roomRef.current[2] = 2;
              }}
            />
            <span>2인</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="player"
              onClick={() => {
                roomRef.current[2] = 3;
              }}
            />
            <span>3인</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="player"
              onClick={() => {
                roomRef.current[2] = 4;
              }}
            />
            <span>4인</span>
          </label>
        </div>
      </div>
      <div className="text-center m-5">
        <button
          type="button"
          className="nes-btn is-warning"
          onClick={() => {
            getRoomInfo();
          }}
        >
          확인
        </button>
        <button
          type="button"
          className="nes-btn is-error m-5"
          onClick={props.func}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
