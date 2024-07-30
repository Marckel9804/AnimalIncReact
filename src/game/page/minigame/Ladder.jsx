import styled from "styled-components";

const Ladder = () => {
  return (
    <LadderContainer>
      <LadderGame>
        <LadderHead>
          Ladder Game <BoxIcon>X</BoxIcon>
        </LadderHead>
        <PlayerList>
          <Player>
            P1<Character>image</Character>
          </Player>
          <Player>
            P2<Character>image</Character>
          </Player>
          <Player>
            P3<Character>image</Character>
          </Player>
          <Player>
            P4<Character>image</Character>
          </Player>
        </PlayerList>
        <RewardList>
          <Reward>당첨</Reward>
          <Reward>꽝</Reward>
          <Reward>꽝</Reward>
          <Reward>꽝</Reward>
        </RewardList>
      </LadderGame>
    </LadderContainer>
  );
};

const LadderContainer = styled.div`
  background-color: #027d7c;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LadderGame = styled.div`
  background-color: #c0c0c0;
  box-shadow: 1px 1px 0px 0.5px black;
  width: 90%;
  height: 80%;
`;

const LadderHead = styled.div`
  background-color: #808080;
  margin: 2px;
  padding: 2px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoxIcon = styled.div`
  background-color: #c0c0c0;
  width: 15px;
  height: 15px;
  box-shadow: 1px 1px 0px 0.5px black;
  text-align: center;
  line-height: normal;
  font-size: 0.8em;

  &:hover {
    cursor: pointer;
  }
`;

const PlayerList = styled.div`
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Player = styled.div`
  text-align: center;
`;

const Character = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 1px 1px 0px 1px #cccccc;
`;

const RewardList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Reward = styled.div``;

export default Ladder;
