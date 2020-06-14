import React, { useState, createContext } from "react";
import { shuffleArray } from "../presentation/utils/arrayShuffle";

const generateRandom0to25 = () =>
  shuffleArray(
    Array.from(Array(25), (_, index) => {
      return { value: index + 1, isMarked: false };
    })
  );

export const GameContext = createContext({ numberBucket: [] });

export const GameProvider = (props) => {
  let [score, setScore] = useState(0);

  const random25 = generateRandom0to25();

  const [numberBucket, setNumberBucket] = useState(
    Array.from(Array(5), (_, row) =>
      Array.from(Array(5), (_, col) => random25[row * 5 + col])
    )
  );

  const markValue = (value) => {
    const updatedBucket = numberBucket.map((numberBucketRow, rowIndex) =>
      numberBucketRow.map((numberItem, colIndex) => {
        if (numberItem.value === value) {
          numberItem.isMarked = true;
          checkBingo(rowIndex, colIndex);
        }
        return numberItem;
      })
    );
    setNumberBucket(updatedBucket);
  };

  const checkBingo = (rowIndex, colIndex) => {
    const isRowBingo = numberBucket[rowIndex].reduce(
      (isBingo, currentItem) => isBingo && currentItem.isMarked,
      true
    );

    const isColBingo = numberBucket.reduce(
      (isBingo, numberBucketRow) =>
        isBingo && numberBucketRow[colIndex].isMarked,
      true
    );

    if (isRowBingo) {
      ++score;
    }

    if (isColBingo) {
      ++score;
    }

    setScore(score);
  };

  return (
    <GameContext.Provider value={[numberBucket, markValue, score]}>
      {props.children}
    </GameContext.Provider>
  );
};
