import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import styled from "styled-components";
import CreateRoom from "./CreateRoom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom";

const RoomList = () => {
  const [user, setUser] = useState(null); // 유저 정보 상태 관리
  const [modal, setModal] = useState(false); // 방 만들기 모달 상태 관리
  const [roomLists, setRoomLists] = useState([]); // 게임방 리스트 상태 관리
  const [selectChannel, setSelectChannel] = useState(null); // 유저가 고른 채널 정보 저장
  const [rerend, setRerend] = useState(false); // 새로고침을 위한 변수
  const navigate = useNavigate();

  // 유저 등급에 따른 채널 정보
  const channelList = ["Bronze", "Silver", "Gold"];
  const channelKR = ["브론즈 채널", "실버 채널", "골드 채널"];

  // 방 만들기 모달 켜고 끄는 메서드
  const createRoom = () => {
    if (user) {
      setModal(!modal);
    } else {
      console.log("User info is not yet loaded.");
    }
  };

  // 유저 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("/api/user/get-profile");
      console.log("Fetched user info: ", res.data);
      setUser(res.data);
    } catch (error) {
      console.log("Failed to fetch user info:", error);
    }
  };

  // 게임방 리스트 불러오기
  const getGameRooms = async (channel) => {
    setSelectChannel(channel);
    try {
      const res = await axios.get(`/api/user/game/selectAllRoom`);
      console.log("방 리스트 받아온거 확인! ", res.data);
      setRoomLists(res.data); // 상태 업데이트 시 중복된 배열 구조 제거
    } catch (error) {
      console.log("Failed to fetch game rooms:", error);
    }
  };

  // 게임방 클릭 시 해당 방으로 이동
  const goWaitingRoom = async (item) => {
    console.log("Selected room:", item);
    try {
      await axios.post(`/api/user/game/updateCount/${item.gameRoomId}`);
      console.log("인원수 증가 완료 ~");
      navigate(`/roomwait/${item.gameRoomId}`);
    } catch (error) {
      console.log("Failed to update room count:", error);
    }
  };

  // 🔄 버튼 누르면 게임방 새로고침
  useEffect(() => {
    if (rerend) {
      getGameRooms(selectChannel);
      setRerend(false);
    }
  }, [rerend, selectChannel]);

  // 최초 로딩 시 유저 정보와 게임방 리스트 불러오기
  useEffect(() => {
    fetchUserInfo();
    getGameRooms("free"); // 기본 채널 선택
  }, []);

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
                const isActive = user && user.userGrade === item;
                return (
                  <ChanelButton
                    className={`nes-btn ${isActive ? "is-primary" : "is-disabled"}`}
                    key={index}
                    onClick={() => getGameRooms(channelList[index])}
                  >
                    {channelKR[index]}
                  </ChanelButton>
                );
              })}
            </div>
            <ChanelButton className="nes-btn" onClick={createRoom}>
              방 만들기
            </ChanelButton>
            <section className="icon-list text-center m-5">
              <i className="nes-logo"></i>
              <i className="nes-octocat animate"></i>
            </section>
          </ChannelList>
          <div className="grid grid-rows-2 gap-4">
            <div className="nes-container is-rounded bg-white">
              <div className="p-2"> * 공지사항</div>
              <Uldiv className="nes-list is-disc">
                <GameList>[공지] 랭크게임 일정 (09/01 ~ 09/30) </GameList>
                <GameList>[공지] 07.25 패치노트 유료 아이템 추가</GameList>
                <GameList>[공지] 7월 PC방 혜택</GameList>
              </Uldiv>
            </div>
            <div className="nes-container is-rounded bg-white">
              <div className="p-2 flex justify-between">
                <p> * 게임방</p>
                {roomLists.length > 0 ? (
                  <button onClick={() => setRerend(true)}> 🔄 </button>
                ) : null}
              </div>
              <Uldiv className="nes-list is-circle">
                {roomLists.length > 0 ? (
                  roomLists
                    .filter((el) => el.tier === selectChannel)
                    .filter((el) => el.players !== el.players + el.bots)
                    .map((item, index) => (
                      <GameList key={index} onClick={() => goWaitingRoom(item)}>
                        [{item.tier}] ({item.players}/{item.players + item.bots}
                        )&nbsp;
                        {item.roomName}
                      </GameList>
                    ))
                ) : (
                  <BeforeList>↖️ 채널을 선택해주세요</BeforeList>
                )}
              </Uldiv>
            </div>
          </div>
          {modal && user ? <CreateRoom func={createRoom} user={user} /> : null}
        </div>
      </RoomBody>
      <Footer />
    </>
  );
};

// 스타일드 컴포넌트 정의
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

const Uldiv = styled.ul`
  height: 25vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const GameList = styled.li`
  &:hover {
    background-color: #cccccc;
    border: 1px dashed black;
  }
`;

const BeforeList = styled.div`
  width: 100%;
  height: 20vh;
  background-color: #cccccc;
  border-radius: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default RoomList;
