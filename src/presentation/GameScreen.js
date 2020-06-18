import React, { useContext, useState } from "react";
import copy from "copy-to-clipboard";
import {
  RDisplay,
  RButton,
  RSection,
  RLink,
  GameBoard,
  GameBox,
  DisplayGameEnd,
  DisplayBingoStatus,
  BingoStatusItem,
  DisplayTurn,
  BingoButton,
  PeerIdInput,
  DisplayPeerId,
  CopyButton,
} from "./StyledComponents";
import { GameContext } from "../application/gameContext";

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
    <RDisplay>
      <DisplayGameEnd hidden={winnerStatus === null} status={winnerStatus}>
        <div>
          {winnerStatus === 0 && "Draw 🤪"}
          {winnerStatus < 0 && "You Lost 😅"}
          {winnerStatus > 0 && "You Won 😁"}
        </div>
        <RButton
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
        >
          Play Again
        </RButton>
      </DisplayGameEnd>

      <RSection hidden={isNotConnected || winnerStatus !== null}>
        <DisplayBingoStatus>
          <BingoStatusItem strike={totalPoints > 0}>B</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 1}>I</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 2}>N</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 3}>G</BingoStatusItem>
          <BingoStatusItem strike={totalPoints > 4}>O</BingoStatusItem>
        </DisplayBingoStatus>

        <GameBoard>{gameBoxes}</GameBoard>
        <DisplayTurn yourTurn={yourTurn}>
          {yourTurn ? "Your Turn" : "Opponents Turn"}
        </DisplayTurn>
        <BingoButton
          onClick={(e) => {
            e.preventDefault();
            callBingo();
          }}
          hidden={totalPoints < 5}
        >
          CALL BINGO
        </BingoButton>
      </RSection>

      <RSection hidden={!isNotConnected || winnerStatus !== null}>
        <form
          hidden={!join}
          onSubmit={(e) => {
            e.preventDefault();
            joinToPeer(opponentPeerId);
          }}
        >
          <PeerIdInput
            value={opponentPeerId}
            placeholder="Enter Game Code"
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
            Generate And Share Code
          </RButton>
        </form>
        <form hidden={join}>
          <DisplayPeerId onClick={copyPeerIdToClipboard}>
            {(connectionState.peer && connectionState.peer.id) ||
              "Generating Code..."}
          </DisplayPeerId>
          <div hidden={!copiedPeerId}>
            (Share this code with your friend and wait for them to join. Do not
            go back!)
          </div>
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
        </form>
        <RLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/RabiRoshan/bingo#instructions"
        >
          Read Instructions
        </RLink>
      </RSection>
    </RDisplay>
  );
};

export default GameScreen;
