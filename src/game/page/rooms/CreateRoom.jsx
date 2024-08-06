import { useRef } from "react";

const CreateRoom = (props) => {
  // 방 만들기 컴포넌트 띄우면 NES 캐릭터들 랜덤으로 뜨게 만듬 (안 뜰때도 있긴 한디 넘어가...)
  const randomRef = useRef([
    "nes-mario",
    "nes-ash",
    "nes-pokeball",
    "nes-bulbasaur",
    "nes-charmander",
    "nes-squirtle",
    "nes-kirby",
  ]);
  let randomChar = Math.floor(Math.random() * 8);

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
          />
        </div>
        <div className="nes-container with-title is-rounded">
          <p className="title">채널 선택</p>
          <label>
            <input type="radio" className="nes-radio" name="channel" checked />
            <span>자유</span>
          </label>

          <label>
            <input type="radio" className="nes-radio" name="channel" />
            <span>골드</span>
          </label>
        </div>
        <div className="nes-container with-title is-rounded">
          <p className="title">인원 선택</p>
          <label>
            <input type="radio" className="nes-radio" name="player" checked />
            <span>1인</span>
          </label>
          <label>
            <input type="radio" className="nes-radio" name="player" />
            <span>2인</span>
          </label>
          <label>
            <input type="radio" className="nes-radio" name="player" />
            <span>3인</span>
          </label>
          <label>
            <input type="radio" className="nes-radio" name="player" />
            <span>4인</span>
          </label>
        </div>
      </div>
      <div className="text-center m-5">
        <button type="button" className="nes-btn is-warning">
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