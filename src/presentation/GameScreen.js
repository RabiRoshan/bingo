import React, { useContext, useState } from "react";
import copy from "copy-to-clipboard";
import styled, { css } from "styled-components";
import { GameContext } from "../application/gameContext";

const Display = styled.div`
  min-height: 100vh;
  background-color: #fbfffe;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const ConnectionSection = styled.div`
  text-align: center;
`;

const DisplayGameEnd = styled.div`
  font-size: 6vw;
  text-align: center;

  ${(props) => {
    if (props.status === 1) {
      return css`
        color: #00a8e8;
      `;
    } else if (props.status === -1) {
      return css`
        color: red;
      `;
    } else {
      return css`
        color: orange;
      `;
    }
  }}
`;

const GameSection = styled.div`
  text-align: center;
`;

const ReadInstructionsLink = styled.a`
  color: #003459;
`;

const JoinForm = styled.form``;

const CreateForm = styled.div``;

const DisplayPeerId = styled.div`
  display: block;
  font-size: 2vw;

  :hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

const DisplayTurn = styled.div`
  display: block;
  color: #003459;
  font-size: 2vw;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
  ${(props) =>
    props.yourTurn &&
    css`
      color: red;
    `}
`;

const DisplayBingoStatus = styled.div`
  display: flex;
  justify-content: space-around;
  color: #003459;
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
  display: block;
  margin: auto;
  background-color: #fbfffe;
  border: 0.3vw solid #00a8e8;
  border-radius: 1vw;
  text-align: center;
  font-size: 2vw;

  :focus {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 6vw;
    border-width: 0.9vw;
    border-radius: 3vw;
  }
`;

const RButton = styled.button`
  background-color: #00a8e8;
  color: #fbfffe;
  margin: 2vw;
  border: none;
  border-radius: 1vw;
  text-align: center;
  font-size: 2vw;

  :focus {
    outline: none;
  }

  :hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    margin: 6vw;
    font-size: 6vw;
    border-radius: 3vw;
  }
`;

const CopyButton = styled(RButton)`
  ${(props) =>
    props.copied &&
    css`
      color: red;
      background-color: #003459;
    `};
`;

const GameBoard = styled.div`
  margin: 2vw;
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: auto;
  place-content: center;
  gap: 0.5vw;

  @media (max-width: 768px) {
    gap: 2vw;
  }
`;

const GameBox = styled.button`
  background-color: #00a8e8;
  color: #fbfffe;
  height: 5vw;
  width: 5vw;
  border: none;
  border-radius: 1vw;
  text-align: center;
  font-size: 2vw;

  :focus {
    outline: none;
  }

  :active {
    background-color: #fbfffe;
    color: #00a8e8;
  }

  ${(props) =>
    props.isMarked &&
    css`
      background-color: red;
    `};

  @media (max-width: 768px) {
    height: 15vw;
    width: 15vw;
    font-size: 6vw;
    border-radius: 3vw;
  }
`;

const BingoButton = styled.button`
  background-color: red;
  margin: 1vw;
  color: white;
  font-size: 2vw;
  border: none;
  border-radius: 1vw;
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
    margin: 3vw;
    border-radius: 3vw;
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

      <GameSection hidden={isNotConnected || winnerStatus !== null}>
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
      </GameSection>

      <ConnectionSection hidden={!isNotConnected || winnerStatus !== null}>
        <JoinForm
          hidden={!join}
          onSubmit={(e) => {
            e.preventDefault();
            joinToPeer(opponentPeerId);
          }}
        >
          <PeerIdInput
            value={opponentPeerId}
            placeholder="Enter Room Id"
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
          <div hidden={!copiedPeerId}>
            (Share Id with opponent and wait for them to join. Do not go back!)
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
        </CreateForm>
        <ReadInstructionsLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/RabiRoshan/bingo#instructions"
        >
          Read Instructions
        </ReadInstructionsLink>
      </ConnectionSection>
    </Display>
  );
};

export default GameScreen;
