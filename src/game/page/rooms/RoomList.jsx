import { useState } from "react";
import styled from "styled-components";
import CreateRoom from "./CreateRoom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const RoomList = () => {
  // 유저 정보 (임시)
  const userNum = 3;

  // 방 만들기 모달 켜고 끄는 메서드
  const [modal, setModal] = useState(false);
  function createRoom() {
    if (modal === false) {
      setModal(true);
    }
    if (modal === true) {
      setModal(false);
    }
  }

  return (
    <>
      <Header />
      <RoomBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChannelList className="nes-container is-rounded">
            <div className="nes-container with-title is-centered">
              <p className="title">채널 선택</p>
              <ChanelButton className="nes-btn is-primary">
                자유 채널
              </ChanelButton>
              <ChanelButton className="nes-btn is-primary">
                브론즈 채널
              </ChanelButton>
              <ChanelButton className="nes-btn is-primary">
                실버 채널
              </ChanelButton>
              <ChanelButton className="nes-btn is-primary">
                골드 채널
              </ChanelButton>
            </div>
            <ChanelButton className="nes-btn" onClick={() => createRoom()}>
              방 만들기
            </ChanelButton>
            <section className="icon-list text-center m-5">
              <i className="nes-logo"></i>
              <i className="nes-octocat animate"></i>
            </section>
          </ChannelList>
          <div className="grid grid-rows-2 gap-4">
            <div className="nes-container is-rounded bg-white">
              * 공지사항
              <ul className="nes-list is-disc">
                <GameList>[공지] 랭크게임 일정 (09/01 ~ 09/30) </GameList>
                <GameList>[공지] 07.25 패치노트 유료 아이템 추가</GameList>
                <GameList>[공지] 7월 PC방 혜택</GameList>
              </ul>
            </div>
            <div className="nes-container is-rounded bg-white">
              <ul className="nes-list is-circle">
                * 게임방
                <GameList>[자유] (1/4) 즐겜하실분~</GameList>
                <GameList>[자유] (3/4) 묻고 더블로 가</GameList>
                <GameList>[골드] (2/4) 헬루!!</GameList>
              </ul>
            </div>
          </div>
          {modal ? <CreateRoom func={createRoom} userNum={userNum} /> : null}
        </div>
      </RoomBody>
      <Footer />
    </>
  );
};

const RoomBody = styled.div`
  width: 100vw;
  margin: 20px auto;
`;

const ChannelList = styled.div`
  background-color: white;
  width: 300px;
`;

const ChanelButton = styled.button`
  width: 100%;
  margin-top: 40px;
`;

const GameList = styled.li`
  &:hover {
    cursor: pointer;
    background-color: #cccccc;
  }
`;

export default RoomList;
