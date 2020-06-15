import React, { useContext, useState } from "react";
import styled, { css } from "styled-components";
import { GameContext } from "../application/gameContext";

const GameWindow = styled.div`
  text-align: center;
`;
const GameBoard = styled.div`
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

  ${(props) =>
    props.hide &&
    css`
      display: none;
    `};
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

  return (
    <GameWindow>
      {isConnected ? (
        <React.Fragment>
          <GameBoard>{gameBoxes}</GameBoard>
          <div>{!yourTurn ? "Opponents Turn" : "Your Turn"}</div>
          <BingoButton hide={totalPoints < 5}>Bingo</BingoButton>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <input
            value={opponentPeerId}
            onChange={(e) => setOpponentPeerId(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              joinToPeer(opponentPeerId);
            }}
          >
            Join
          </button>
        </React.Fragment>
      )}
    </GameWindow>
  );
};

export default GameScreen;
