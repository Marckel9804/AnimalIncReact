import { useEffect, useRef, useState } from "react";
import axios from "../../../utils/axios.js";
import styled from "styled-components";
import CreateRoom from "./CreateRoom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const RoomList = () => {
  // 유저 정보 (임시)
  const user = [{ userNum: 47, userGrade: "Gold" }];

  // userGrade에 따라 선택할 수 있는 채널이 달라짐
  const channelList = ["bronze", "silver", "Gold"];
  const channelKR = ["브론즈 채널", "실버 채널", "골드 채널"];

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

  // 게임방 리스트 불러오기
  const [roomLists, setRoomLists] = useState([]);
  const [selectChannel, setSelectChannel] = useState();
  const getGameRooms = (e) => {
    // 선택한 채널을 스테이트 변수에 세팅
    setSelectChannel(e);
    // 모오든 방 정보 받아오자~
    axios
      .get(`/api/user/game/selectAllRoom`)
      .then((res) => {
        console.log("방 리스트 받아온거 확인! ", res.data);
        setRoomLists([res.data]);
        console.log("roomLists : ", roomLists[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Header />
      <RoomBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChannelList className="nes-container is-rounded">
            <div className="nes-container with-title is-centered">
              <p className="title">채널 선택</p>
              <ChanelButton
                className="nes-btn is-primary"
                onClick={() => getGameRooms("free")}
              >
                자유 채널
              </ChanelButton>
              {channelList.map((item, index) => {
                let active = "";
                {
                  user[0].userGrade === item
                    ? (active = "nes-btn is-primary")
                    : (active = "nes-btn is-disabled");
                }
                return (
                  <ChanelButton
                    className={active}
                    key={index}
                    onClick={() => getGameRooms(channelList[index])}
                  >
                    {channelKR[index]}
                  </ChanelButton>
                );
              })}
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
                {/* 유저가 클릭한 채널의 방만 보이도록 필터링 후 출력하기 */}
                {roomLists.length > 0 && roomLists[0] ? (
                  roomLists[0]
                    .filter((el) => {
                      console.log(selectChannel);
                      console.log(
                        "방 정보 == 선택 채널 일치 여부 : ",
                        el.tier === selectChannel
                      );
                      return el.tier === selectChannel;
                    })
                    .map((item, index) => (
                      <GameList key={index}>
                        [{item.tier}] ({item.players}/{item.players + item.bots}
                        )&nbsp;
                        {item.roomName}
                      </GameList>
                    ))
                ) : (
                  <BeforeList>채널을 선택해주세요 !</BeforeList>
                )}
              </ul>
            </div>
          </div>
          {modal ? <CreateRoom func={createRoom} user={user} /> : null}
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

const BeforeList = styled.div`
  width: 100%;
  height: 25vh;
  background-color: #cccccc;
  border-radius: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default RoomList;
