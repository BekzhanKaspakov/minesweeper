import { useCallback, useEffect, useState } from "react";
import Cell from "../cell";

import "./style.css";

interface BoardProps {
  mines: number;
  gameStatus: string;
  height: number;
  width: number;
}

interface BoardState {
  grid: GridCell[][];
  minesCount: number;
  gameStatus: string;
  revealedCells: number;
}

export const Board = (props: BoardProps) => {
  /* Helpers */
  const getNeighbours = (grid: GridCell[][], y: number, x: number) => {
    const neighbours = [];
    const currentRow = grid[y];
    const prevRow = grid[y - 1];
    const nextRow = grid[y + 1];

    if (currentRow[x - 1]) neighbours.push(currentRow[x - 1]);
    if (currentRow[x + 1]) neighbours.push(currentRow[x + 1]);
    if (prevRow) {
      if (prevRow[x - 1]) neighbours.push(prevRow[x - 1]);
      if (prevRow[x]) neighbours.push(prevRow[x]);
      if (prevRow[x + 1]) neighbours.push(prevRow[x + 1]);
    }
    if (nextRow) {
      if (nextRow[x - 1]) neighbours.push(nextRow[x - 1]);
      if (nextRow[x]) neighbours.push(nextRow[x]);
      if (nextRow[x + 1]) neighbours.push(nextRow[x + 1]);
    }

    return neighbours;
  };

  const revealEmptyNeigbhours = (grid: GridCell[][], y: number, x: number) => {
    const neighbours = [...getNeighbours(grid, y, x)];
    grid[y][x].isFlagged = false;
    grid[y][x].isRevealed = true;

    while (neighbours.length) {
      const neighbourGridCell = neighbours.shift();
      if (neighbourGridCell == undefined) {
        throw new Error();
      }

      if (neighbourGridCell.isRevealed) {
        continue;
      }
      if (neighbourGridCell.isEmpty) {
        neighbours.push(
          ...getNeighbours(grid, neighbourGridCell.y, neighbourGridCell.x)
        );
      }

      neighbourGridCell.isFlagged = false;
      neighbourGridCell.isRevealed = true;
    }
  };

  const checkVictory = () => {
    const { height, width, mines } = props;
    const revealed = getRevealed();

    if (revealed >= height * width - mines) {
      killBoard("win");
    }
  };

  const getRevealed = () => {
    if (state == null) throw new Error();
    return state.grid
      .reduce((r, v) => {
        r.push(...v);
        return r;
      }, [])
      .map((v) => v.isRevealed)
      .filter((v) => !!v).length;
  };

  const killBoard = (type: string) => {
    const message = type === "lost" ? "You lost." : "You won.";

    setState((state) => ({ ...state, gameStatus: message }));
    revealBoard();
  };
  const addGridCell = (grid: GridCell[][], gridCell: GridCell) => {
    const y = grid.length - 1;
    const x = grid[y].length;
    const lastGridCell = gridCell;
    const neighbours = getNeighbours(grid, y, x);

    for (const neighbourGridCell of neighbours) {
      if (lastGridCell.isMine) {
        neighbourGridCell.n += 1;
      } else if (neighbourGridCell.isMine) {
        lastGridCell.n += 1;
      }
    }

    grid[y].push(gridCell);
  };

  const getRandomMines = (
    amount: number,
    columns: number,
    rows: number,
    starter: number | null = null
  ) => {
    const minesArray = [];
    const limit = columns * rows;
    const minesPool = [...Array(limit).keys()];

    if (starter !== null && starter > 0 && starter < limit) {
      minesPool.splice(starter, 1);
    }

    for (let i = 0; i < amount; ++i) {
      const n = Math.floor(Math.random() * minesPool.length);
      minesArray.push(...minesPool.splice(n, 1));
    }

    return minesArray;
  };
  // Board utilities
  const createNewBoard = (click: number | null = null) => {
    const grid: GridCell[][] = [];
    const rows = props.width;
    const columns = props.height;
    const minesCount = props.mines;
    const minesArray = getRandomMines(minesCount, columns, rows, click);

    for (let i = 0; i < columns; ++i) {
      grid.push([]);
      for (let j = 0; j < rows; ++j) {
        const gridCell = new GridCell(i, j, minesArray.includes(i * rows + j));
        addGridCell(grid, gridCell);
      }
    }

    return grid;
  };

  const getInitialState = () => {
    const initialState = {
      grid: createNewBoard(),
      minesCount: props.mines,
      gameStatus: props.gameStatus,
      revealedCells: 0,
    };
    return initialState;
  };

  const [state, setState] = useState<BoardState>(getInitialState());

  const revealBoard = () => {
    const grid = state?.grid;
    if (!grid) throw new Error("");

    for (const row of grid) {
      for (const gridCell of row) {
        gridCell.isRevealed = true;
      }
    }
  };

  const restartBoard = () => {
    setState(getInitialState());
  };

  // Cell click handlers
  const handleLeftClick = (y: number, x: number) => {
    if (state == null) throw new Error();
    let grid;
    if (state.revealedCells === 0) {
      grid = createNewBoard(y * props.width + x);
    } else {
      grid = state.grid;
    }
    const gridCell = grid[y][x];

    if (gridCell.isRevealed) {
      const neighbours = [...getNeighbours(grid, y, x)];
      const hidden = neighbours.filter((x) => !x.isRevealed && !x.isFlagged);
      const flaggedNeighbors = neighbours.filter((x) => x.isFlagged);

      if (gridCell.n === flaggedNeighbors.length) {
        hidden.forEach((x) => {
          handleLeftClick(x.y, x.x);
        });
      }
    }

    gridCell.isClicked = true;

    // Might want to add an "isUnknown" state later
    if (gridCell.isRevealed || gridCell.isFlagged) {
      return false;
    }

    // End game if mine
    if (gridCell.isMine) {
      killBoard("lost");
      return false;
    }

    if (gridCell.isEmpty) {
      revealEmptyNeigbhours(grid, y, x);
    }

    state.revealedCells++;

    gridCell.isFlagged = false;
    gridCell.isRevealed = true;

    setState({ ...state, grid });

    checkVictory();
  };

  // Cell right-click handler
  const handleRightClick = (
    e: React.MouseEvent<HTMLElement>,
    y: number,
    x: number
  ) => {
    e.preventDefault();
    if (!state) throw new Error();
    const grid = state.grid;
    let minesLeft = state.minesCount;

    // Check if already revealed
    if (grid[y][x].isRevealed) {
      const neighbours = [...getNeighbours(grid, y, x)];
      const hidden = neighbours.filter((x) => !x.isRevealed && !x.isFlagged);
      const flagged = neighbours.filter((x) => x.isFlagged);
      if (hidden.length + flagged.length === grid[y][x].n) {
        hidden.forEach((x) => handleRightClick(e, x.y, x.x));
      }
      return false;
    }

    if (grid[y][x].isFlagged) {
      grid[y][x].isFlagged = false;
      minesLeft++;
    } else {
      grid[y][x].isFlagged = true;
      minesLeft--;
    }

    setState((state) => ({
      ...state,
      minesCount: minesLeft,
    }));
  };

  useEffect(() => {
    restartBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (e.isComposing || e.code === "KeyR") {
        restartBoard();
      }
    },
    [restartBoard]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler, false);
    return () => window.removeEventListener("keydown", handler, false);
  }, [handler]);

  // Rendering functions
  const renderBoard = () => {
    const grid = state.grid;

    return grid.map((row) => {
      const rowCells = row.map((gridCell) => (
        <Cell
          key={gridCell.y * row.length + gridCell.x}
          onClick={() => handleLeftClick(gridCell.y, gridCell.x)}
          cMenu={(e) => handleRightClick(e, gridCell.y, gridCell.x)}
          value={gridCell}
        />
      ));

      return <div className="row">{rowCells}</div>;
    });
  };

  return (
    <div className="board">
      <div className="mines-count">
        <button onClick={restartBoard}>Restart</button>
        <span>Mines: {state.minesCount}</span>
      </div>
      <div className="grid">{renderBoard()}</div>
    </div>
  );
};

class GridCell {
  x: number;
  y: number;
  n: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isUnknown: boolean;
  isClicked: boolean;

  constructor(y: number, x: number, isMine: boolean) {
    this.x = x;
    this.y = y;
    this.n = 0;
    this.isMine = isMine;
    this.isRevealed = false;
    this.isFlagged = false;
    this.isUnknown = false;
    this.isClicked = false;
  }
  get isEmpty() {
    return this.n === 0 && !this.isMine;
  }
}

export { GridCell };
export default Board;
