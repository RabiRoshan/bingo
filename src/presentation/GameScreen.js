import React, { useContext, useState } from "react";
import copy from "copy-to-clipboard";
import styled, { css } from "styled-components";
import { GameContext } from "../application/gameContext";

const Display = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const ConnectionSection = styled.div`
  text-align: center;
`;

const GameSection = styled.div`
  text-align: center;
`;

const JoinForm = styled.div``;

const CreateForm = styled.div``;

const DisplayPeerId = styled.div`
  font-size: 2vw;
  display: block;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

const DisplayTurn = styled.div`
  font-size: 2vw;
  display: block;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

const PeerIdInput = styled.input`
  text-align: center;
  font-size: 2vw;
  display: block;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

const RButton = styled.button`
  margin: 2vw;
  font-size: 2vw;

  @media (max-width: 768px) {
    font-size: 6vw;
    margin: 6vw;
  }
`;

const GameBoard = styled.div`
  margin: 5vw;
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: auto;
  gap: 0.5vw;
  place-content: center;
  @media (max-width: 768px) {
    gap: 2vw;
  }
`;

const GameBox = styled.button`
  background-color: slateblue;
  color: white;
  font-size: 2vw;
  height: 5vw;
  width: 5vw;
  border: none;
  text-align: center;

  :focus {
    outline: none;
  }

  :active {
    background-color: white;
    color: slateblue;
  }

  ${(props) =>
    props.isMarked &&
    css`
      background-color: red;
      color: white;
    `};

  @media (max-width: 768px) {
    height: 15vw;
    width: 15vw;
    font-size: 6vw;
  }
`;

const BingoButton = styled.button`
  background-color: slategray;
  color: white;
  font-size: 2vw;
  border: none;
  text-align: center;

  :focus {
    outline: none;
  }

  :active {
    background-color: white;
    color: slategray;
  }

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

const GameScreen = () => {
  const [
    numberBucket,
    markValue,
    connectionState,
    joinToPeer,
    yourTurn,
  ] = useContext(GameContext);

  const [opponentPeerId, setOpponentPeerId] = useState("");
  const [join, setJoin] = useState(true);
  const [copiedPeerId, setCopiedPeerId] = useState(false);

  const isConnected = connectionState.peer && connectionState.opponentPeer;

  const rowPoints = numberBucket.reduce((totalPoints, currentItem) => {
    const isRowBingo = currentItem.reduce((isBingo, currentItem) => {
      return isBingo && currentItem.isMarked;
    }, true);
    return isRowBingo ? ++totalPoints : totalPoints;
  }, 0);

  const colPoints = numberBucket
    .reduce(
      (colPointArray, currentItem) => {
        currentItem.forEach((item, index) => {
          colPointArray[index] = colPointArray[index] && item.isMarked ? 1 : 0;
        });

        return colPointArray;
      },
      Array.from(Array(5), () => 1)
    )
    .reduce((a, b) => a + b);

  const totalPoints = rowPoints + colPoints;

  const gameBoxes = numberBucket.map((numberBucketRow) =>
    numberBucketRow.map((numberItem) => {
      const { value, isMarked } = numberItem;
      return (
        <GameBox
          key={value}
          disabled={isMarked || !yourTurn}
          onClick={(e) => {
            e.preventDefault();
            return markValue(value);
          }}
          isMarked={isMarked}
        >
          {value}
        </GameBox>
      );
    })
  );

  const copyPeerIdToClipboard = () => {
    copy(connectionState.peer && connectionState.peer.id);
    setCopiedPeerId(true);
  };

  return (
    <Display>
      <GameSection hidden={!isConnected}>
        <DisplayTurn>{!yourTurn ? "Opponents Turn" : "Your Turn"}</DisplayTurn>
        <GameBoard>{gameBoxes}</GameBoard>
        <BingoButton hidden={totalPoints < 5}>Bingo</BingoButton>
      </GameSection>

      <ConnectionSection hidden={isConnected}>
        <JoinForm hidden={!join}>
          <PeerIdInput
            value={opponentPeerId}
            onChange={(e) => setOpponentPeerId(e.target.value)}
          />
          <RButton
            onClick={(e) => {
              e.preventDefault();
              joinToPeer(opponentPeerId);
            }}
          >
            Join
          </RButton>
          <div>or</div>
          <RButton
            onClick={(e) => {
              e.preventDefault();
              setJoin(false);
            }}
          >
            Create
          </RButton>
        </JoinForm>
        <CreateForm hidden={join}>
          <DisplayPeerId onClick={copyPeerIdToClipboard}>
            {(connectionState.peer && connectionState.peer.id) ||
              "Creating Id..."}
          </DisplayPeerId>
          <RButton
            onClick={(e) => {
              e.preventDefault();
              setJoin(true);
            }}
          >
            Back
          </RButton>
          <RButton
            onClick={(e) => {
              e.preventDefault();
              copyPeerIdToClipboard();
            }}
          >
            {copiedPeerId ? "Copied" : "Copy"}
          </RButton>
        </CreateForm>
      </ConnectionSection>
    </Display>
  );
};

export default GameScreen;
