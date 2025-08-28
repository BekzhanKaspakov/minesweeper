import { useState } from "react";

import { Board } from "src/components/board";

type GameState = {
  height: number;
  width: number;
  mines: number;
  gameStatus: string;
};

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export const Game = () => {
  const [state, setState] = useState<GameState>({
    height: 8,
    width: 8,
    mines: 10,
    gameStatus: "0",
  });

  const handleChangeDifficulty = (difficulty: Difficulty) => {
    let height;
    let width;
    let mines;
    switch (difficulty) {
      case Difficulty.EASY: {
        height = 13;
        width = 15;
        mines = 32;
        break;
      }
      case Difficulty.MEDIUM: {
        height = 14;
        width = 18;
        mines = 47;
        break;
      }
      default: {
        height = 16;
        width = 20;
        mines = 66;
        break;
      }
    }
    setState({ ...state, height, width, mines });
  };

  const { height, width, mines, gameStatus } = state;
  return (
    <div className="game">
      <div>
        {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map(
          (x) => (
            <button
              onClick={() => {
                handleChangeDifficulty(Difficulty[x]);
              }}
            >
              {x}
            </button>
          ),
        )}
      </div>
      <Board
        height={height}
        width={width}
        mines={mines}
        gameStatus={gameStatus}
      />
      <div className="control-buttons">
        <form>
          <label>Height</label>
        </form>
      </div>
    </div>
  );
};
