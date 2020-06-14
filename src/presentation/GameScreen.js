import React, { useContext } from "react";
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
  const [numberBucket, markValue, score] = useContext(GameContext);
  const gameBoxes = numberBucket.map((numberBucketRow) =>
    numberBucketRow.map((numberItem) => {
      const { value, isMarked } = numberItem;
      return (
        <GameBox
          key={value}
          disabled={isMarked}
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
      <GameBoard>{gameBoxes}</GameBoard>
      <BingoButton hide={score < 5}>Bingo</BingoButton>
    </GameWindow>
  );
};

export default GameScreen;
