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

const JoinForm = styled.form``;

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

const DisplayBingoStatus = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 2vw;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

const BingoStatusItem = styled.div`
  ${(props) =>
    props.strike &&
    css`
      text-decoration: line-through;
      color: red;
    `};
`;

const PeerIdInput = styled.input`
  text-align: center;
  font-size: 2vw;
  display: block;
  margin: auto;
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

const CopyButton = styled(RButton)`
  ${(props) =>
    props.copied &&
    css`
      color: red;
    `};
`;

const GameBoard = styled.div`
  margin: 2vw;
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
  const {
    numberBucket,
    markValue,
    connectionState,
    joinToPeer,
    yourTurn,
    winnerStatus,
    callBingo,
  } = useContext(GameContext);

  const [opponentPeerId, setOpponentPeerId] = useState("");
  const [join, setJoin] = useState(true);
  const [copiedPeerId, setCopiedPeerId] = useState(false);

  const isNotConnected =
    connectionState.peer && connectionState.opponentPeer ? false : true;

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

  const diagonalOnePoint = numberBucket.reduce(
    (diagonalScore, currentItem, currentIndex) => {
      diagonalScore =
        diagonalScore && currentItem[currentIndex].isMarked ? 1 : 0;
      return diagonalScore;
    },
    1
  );

  const diagonalTwoPoint = numberBucket.reduce(
    (diagonalScore, currentItem, currentIndex) => {
      diagonalScore =
        diagonalScore && currentItem[4 - currentIndex].isMarked ? 1 : 0;
      return diagonalScore;
    },
    1
  );

  const totalPoints =
    rowPoints + colPoints + diagonalOnePoint + diagonalTwoPoint;

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
      {winnerStatus === 0 && "Draw"}
      {winnerStatus < 0 && "You Lost"}
      {winnerStatus > 0 && "You Won"}

      <GameSection hidden={isNotConnected || winnerStatus !== null}>
        <DisplayTurn>{!yourTurn ? "Opponents Turn" : "Your Turn"}</DisplayTurn>
        <DisplayBingoStatus>
          <BingoStatusItem strike={totalPoints > 0}>B</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 1}>I</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 2}>N</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 3}>G</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 4}>O</BingoStatusItem>
        </DisplayBingoStatus>
        <GameBoard>{gameBoxes}</GameBoard>
        <BingoButton
          onClick={(e) => {
            e.preventDefault();
            callBingo();
          }}
          hidden={totalPoints < 5}
        >
          Bingo
        </BingoButton>
      </GameSection>

      <ConnectionSection hidden={!isNotConnected}>
        <JoinForm
          hidden={!join}
          onSubmit={(e) => {
            e.preventDefault();
            joinToPeer(opponentPeerId);
          }}
        >
          <PeerIdInput
            value={opponentPeerId}
            placeholder="Enter Opponent Id"
            required
            onChange={(e) => setOpponentPeerId(e.target.value)}
          />
          <RButton>Join</RButton>
          <div>or</div>
          <RButton
            onClick={(e) => {
              e.preventDefault();
              setJoin(false);
            }}
          >
            Create And Share Id
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
          <CopyButton
            copied={copiedPeerId ? true : false}
            onClick={(e) => {
              e.preventDefault();
              copyPeerIdToClipboard();
            }}
          >
            {copiedPeerId ? "Copied" : "Copy"}
          </CopyButton>
        </CreateForm>
      </ConnectionSection>
    </Display>
  );
};

export default GameScreen;
