import "./style.css";

const appElement: Element | null = document.getElementById("app");
const boardElement: Element | null = document.getElementById("board");
const ROW_COUNT: number = 3;
const COL_COUNT: number = 3;

type Cell = "X" | "O" | ""
type TicTacToeBoard = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
]

let boardState: TicTacToeBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
let currentMove: "X" | "O" = "X";
let gameOver: boolean = false;
let moveCount: number = 0;

function createCell(row: number, col: number, content: Cell = "") {
  const cell: Element = document.createElement("button");
  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", content);
  cell.classList.add("cell");
  cell.addEventListener("click", () => {

    if (gameOver || boardState[row][col] != "") return
    boardState[row][col] = currentMove;
    checkWinCondition();
    renderBoard();
  })
  return cell;
}

function renderBoard() {
  if (!appElement) throw new Error("Cannot find app");
  if (!boardElement) throw new Error("Cannot find board");
  boardElement.innerHTML = "";
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, boardState[i][j]));
    }
  }
  const oldMoveElement: Element | null = document.getElementById("move-element");
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement: HTMLParagraphElement = document.createElement("p");
  moveElement.id = "move-element";
  moveElement.innerText = `Next Move: ${currentMove}`;
  moveElement.classList.add("current-move");
  appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function init() {
  const resetButton = document.getElementById("reset");
  if (!resetButton) throw new Error("No Reset button");
  resetButton.addEventListener("click", () => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    currentMove = "X";
    gameOver = false;
    moveCount = 0;
    renderBoard();
  });
  renderBoard();
}

function checkWinCondition() {
  const [tl, tm, tr, ml, mm, mr, bl, bm, br]: string[] = [
    boardState[0][0], boardState[0][1], boardState[0][2],  // Top row: left, middle, right
    boardState[1][0], boardState[1][1], boardState[1][2],  // Middle row: left, middle, right
    boardState[2][0], boardState[2][1], boardState[2][2]   // Bottom row: left, middle, right
  ];

  if (tl == "" && mm == "" && br == "") return;
  if (
    // horizontal wins
    (tl != "" && tl == tm && tm == tr || ml != "" && ml == mm && mm == mr || bl != "" && bl == bm && bm == br) ||
    // vertical wins
    (tl != "" && tl == ml && ml == bl || tm != "" && tm == mm && mm == bm || tr != "" && tr == mr && mr == br) ||
    // diagonal wins
    (tl != "" && tl == mm && mm == br || tr != "" && tr == mm && mm == bl)
  ) {
    gameOver = true;
    console.log(`${currentMove} WINS!`)
  } else if (moveCount >= 8) {
    gameOver = true;
    console.log("Tie!");
  }

  currentMove = currentMove == "X" ? "O" : "X";
  moveCount++;
}

init();
