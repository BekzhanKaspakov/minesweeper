import { GridCell } from "../board";
import "./style.css";

interface CellProps {
  value: GridCell;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  cMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Cell = (props: CellProps) => {
  const getValue = () => {
    const { value } = props;

    if (!value.isRevealed) {
      return props.value.isFlagged ? "🚩" : null;
    } else if (value.isMine) {
      return "💣";
    } else if (value.isEmpty) {
      return "";
    }

    return value.n;
  };

  const className =
    "cell" +
    (props.value.isRevealed ? "" : " hidden") +
    (props.value.isMine ? " is-mine" : "") +
    (props.value.isClicked ? " is-clicked" : "") +
    (props.value.isEmpty ? " is-empty" : "") +
    (props.value.isUnknown ? " is-unknown" : "") +
    (props.value.isFlagged ? " is-flag" : "") +
    ` n-${props.value.n}`;

  return (
    <div
      className={className}
      onClick={props.onClick}
      onContextMenu={props.cMenu}
    >
      {getValue()}
    </div>
  );
};

export default Cell;
