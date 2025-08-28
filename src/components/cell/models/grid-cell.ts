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
