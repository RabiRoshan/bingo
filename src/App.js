import React from "react";
import "./App.css";
import GameScreen from "./presentation/GameScreen";
import { GameProvider } from "./application/gameContext";

function App() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}

export default App;
