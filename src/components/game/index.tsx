import React, { useState } from "react";
import Board from "../board";

import "./style.css";

type GameState = {
  height: number;
  width: number;
  mines: number;
  gameStatus: string;
};

export const Game = () => {
  const [state, setState] = useState<GameState>({
    height: 8,
    width: 8,
    mines: 10,
    gameStatus: "0",
  });

  const handleChange = (
    prop: keyof GameState,
    value: GameState[keyof GameState]
  ) => {
    setState((state) => ({ ...state, [prop]: value }));
  };

  const handleChangeHeight = (event: React.FormEvent<HTMLInputElement>) => {
    const val = clamp(Number(event.currentTarget.value), 5, 18);
    handleChange("height", val);
  };

  const handleChangeWidth = (event: React.FormEvent<HTMLInputElement>) => {
    const val = clamp(Number(event.currentTarget.value), 5, 18);
    handleChange("width", val);
  };

  const handleChangeMines = (event: React.FormEvent<HTMLInputElement>) => {
    const cap = Math.floor((state.height * state.width) / 3);
    const val = clamp(Number(event.currentTarget.value), 1, cap);
    handleChange("mines", val);
  };

  // const restartGame = () => {
  //   boardElement.current.restartBoard();
  // };

  const { height, width, mines, gameStatus } = state;
  return (
    <div className="game">
      <Board
        // ref={boardElement.current ?? null}
        height={height}
        width={width}
        mines={mines}
        gameStatus={gameStatus}
      />
      <div className="control-buttons">
        <form>
          <label>Height</label>
          <input
            type="number"
            value={state.height}
            onChange={handleChangeHeight}
          />
          <label>Width</label>
          <input
            type="number"
            value={state.width}
            onChange={handleChangeWidth}
          />
          <label>Mines</label>
          <input
            type="number"
            value={state.mines}
            onChange={handleChangeMines}
          />
        </form>
      </div>
    </div>
  );
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}
