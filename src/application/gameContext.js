import React, { useState, createContext } from "react";
import { shuffleArray } from "../presentation/utils/arrayShuffle";
import Peer from "peerjs";
const peer = new Peer();

export const GameContext = createContext({ numberBucket: [] });

export const GameProvider = (props) => {
  const random25 = generateRandom0to25();

  const [numberBucket, setNumberBucket] = useState(
    Array.from(Array(5), (_, row) =>
      Array.from(Array(5), (_, col) => random25[row * 5 + col])
    )
  );

  const [yourTurn, setYourTurn] = useState(true);

  // winnerStatus = 0 => draw
  // winnerStatus = -1 => opponent won
  // winnerStatus = 1 => you won
  let [winnerStatus, setWinnerStatus] = useState(null);

  const callBingo = (fromOpponent = false) => {
    const updatedWinnerStatus = winnerStatus === null ? 0 : winnerStatus;
    if (fromOpponent) {
      setWinnerStatus(updatedWinnerStatus - 1);
    } else {
      setWinnerStatus(updatedWinnerStatus + 1);
      connectionState.opponentPeer.send({ bingo: true });
    }
  };

  const markValue = (value, fromOpponent = false) => {
    if (!fromOpponent) {
      setYourTurn(false);
      connectionState.opponentPeer.send({ value });
    } else {
      setYourTurn(true);
    }
    const updatedBucket = numberBucket.map((numberBucketRow) =>
      numberBucketRow.map((numberItem) => {
        if (numberItem.value === value) {
          numberItem.isMarked = true;
        }
        return numberItem;
      })
    );
    setNumberBucket(updatedBucket);
  };

  // PeerJS
  const [connectionState, setConnectionState] = useState({
    peer: null,
    opponentPeer: null,
  });

  peer.on("open", (peerId) => {
    console.log(`Your peer ID is: ${peerId}`);
    setConnectionState({ ...connectionState, peer });
  });

  peer.on("disconnected", () => {
    console.log(`Disconnected from peer server`);
    setConnectionState({ ...connectionState, peer: null });
  });

  peer.on("connection", (conn) => onConnection(conn));

  const joinToPeer = (opponentPeerId) => {
    const opponentPeer = peer.connect(opponentPeerId);
    setYourTurn(false);
    onConnection(opponentPeer);
  };

  const onConnection = (opponentPeer) => {
    console.log(`Connecting to: ${opponentPeer.peer}`);
    opponentPeer.on("open", () => {
      console.log("Connected!");
      setConnectionState({ ...connectionState, opponentPeer });
    });
    opponentPeer.on("data", (data) => {
      console.log(`Data from ${opponentPeer.peer}: ${data}`);
      if (data.value) {
        markValue(data.value, true);
      }
      if (data.bingo) {
        callBingo(true);
      }
    });
    opponentPeer.on("close", () => {
      console.log(`Connection closed with: ${opponentPeer.peer}`);
      console.log("Reconnecting...");
      peer.connect(opponentPeer.peer);
    });
    opponentPeer.on("error", (err) =>
      console.log(`Connection Error with ${opponentPeer.peer}: ${err}`)
    );
  };

  return (
    <GameContext.Provider
      value={{
        numberBucket,
        markValue,
        connectionState,
        joinToPeer,
        yourTurn,
        winnerStatus,
        callBingo,
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};

const generateRandom0to25 = () =>
  shuffleArray(
    Array.from(Array(25), (_, index) => {
      return { value: index + 1, isMarked: false };
    })
  );
