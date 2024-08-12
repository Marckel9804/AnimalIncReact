import { useEffect, useRef, useState } from "react";
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
  const navigate = useNavigate();

  // 로그인한 유저 번호 (UserNum) 가져오기
  const [userInfo, setUserInfo] = useState();
  console.log("로그인 유저 정보 ? ", userInfo);
  useEffect(() => {
    const getUserInfo = async () => {
      // 로그인한 유저 정보 받아옴 (여기서는 유저 이메일만 확인 가능)
      await axios
        .get(`/api/user/me`)
        .then((res) => {
          // 가져온 유저 이메일로 유저 정보를 다시 조회해서 state 에 저장
          let email = res.data.claims.userEmail;
          axios
            .get(`api/user/game/selectUser/${email}`)
            .then((res) => {
              setUserInfo(res.data);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getUserInfo();
  }, []);

  // userGrade에 따라 선택할 수 있는 채널이 달라짐
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

  // 게임방 리스트 불러오기
  const [selectChannel, setSelectChannel] = useState(); //유저가 고른 채널 정보 저장
  const [rerend, setRerend] = useState(false); //새로고침을 위한 변수

  const getGameRooms = (channel) => {
    // 선택한 채널을 스테이트 변수에 세팅
    setSelectChannel(channel);
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

  // 유저 정보를 가져오는 함수
  const fetchUserInfo = () => {
    axios
      .get("/api/user/get-profile")
      .then((res) => {
        console.log("Fetched user info: ", res.data);
        setUser(res.data); // 유저 정보를 상태에 저장
      })
      .catch((error) => {
        console.log("Failed to fetch user info:", error);
      });
  };

  useEffect(() => {
    getGameRooms();
    fetchUserInfo(); // 유저 정보 가져오기
  }, []);
  // 게임방 클릭하면 해당 게임방으로 이동 (게임방 인원 +1)
  const goWaitingRoom = (item) => {
    console.log("item >>> ", item);
    // 방에 들어가면 인원수를 증가시키자 !
    axios
      .post(`/api/user/game/updateCount/${item.gameRoomId}`)
      .then(() => {
        console.log("인원수 증가 완료 ~");
        navigate(`/roomwait/${item.gameRoomId}`);
      })
      .catch((error) => console.log(error));
  };

  // 공지사항 불러오기 (notice 최신글 10개까지만 출력)
  const [notice, setNotice] = useState();
  useEffect(() => {
    getNoticeList();
  }, []);

  const getNoticeList = () => {
    axios
      .get(`/api/board`)
      .then((res) => {
        console.log("공지사항 ! ", res.data);
        setNotice(res.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 🔄 버튼 누르면 게임방 새로고침
  useEffect(() => {
    if (rerend === true) {
      getGameRooms(selectChannel);
      setRerend(false);
    }
  }, [rerend]);

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
              {userInfo === undefined
                ? null
                : channelList.map((item, index) => {
                    let active = "";
                    {
                      userInfo.userGrade === item
                        ? (active = "nes-btn is-primary")
                        : (active = "nes-btn is-disabled");
                    }
                    let param = "";
                    if (active === "nes-btn is-primary") {
                      param = channelList[index];
                    }
                    return (
                      <ChanelButton
                        className={active}
                        key={index}
                        onClick={() => getGameRooms(param)}
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
                {notice === undefined
                  ? null
                  : notice.map((item, index) => {
                      return (
                        <GameList
                          key={index}
                          onClick={() => navigate(`/board/detail/${item.bcId}`)}
                        >
                          [{item.bcCode}] {item.title}
                        </GameList>
                      );
                    })}
              </Uldiv>
            </div>
            <div className="nes-container is-rounded bg-white">
              <div className="p-2 flex justify-between">
                <p> * 게임방</p>
                {roomLists.length > 0 && roomLists[0] ? (
                  <button onClick={() => setRerend(true)}> 🔄 </button>
                ) : null}
              </div>
              <Uldiv className="nes-list is-circle">
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
                    .filter((el) => {
                      // 방이 다 찼으면 리스트에 안 띄움
                      let participants = el.players;
                      let total = el.players + el.bots;
                      return participants !== total;
                    })
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
          {modal ? <CreateRoom func={createRoom} user={userInfo} /> : null}
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
