import { TURN, CELL_VALUE, GAME_STATUS } from "./constants.js";
import {
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getCellElementAtIdx,
  getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

// console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));
// console.log(checkGameStatus(["X", "O", "X", "X", "O", "X", "O", "X", "O"]));
// console.log(checkGameStatus(["X", "", "X", "X", "O", "X", "O", "X", "O"]));
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.add("show");
}
function hideReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error(" Invalid win positions");
  }
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  const isClick =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  //only allow to click if game is playing and that cell is not clicked yet
  if (isClick || isEndGame) return;

  //set selected cell
  cell.classList.add(currentTurn);

  // Update cellValues
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
  //check game Status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      //Update game status
      updateGameStatus(game.status);

      //show replay button
      showReplayButton();
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      //Update game status
      updateGameStatus(game.status);
      //show replay button
      showReplayButton();

      // highlight win cells
      highlightWinCells(game.winPositions);
      break;
    }
    default:
    //playing
  }

  //** toggle turn*/
  toggleTurn();
}

function initCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });
}

function resetGame() {
  // reset temp global variables
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");

  //reset dom elements
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);

  //reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }
  // hide replay button
  hideReplayButton();
}

function initReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) {
    replayButton.addEventListener("click", resetGame);
  }
}

/**
 * TODOs
 *
 ** 1. Bind click event for all cells
 ** 2. On cell click, do the following:
 **   - Toggle current turn
 **    - Mark current turn to the selected cell
 **    - Check game state: win, ended or playing
 **    - If game is win, highlight win cells
 **    - Not allow to re-click the cell having value.
 *
 ** 3. If game is win or ended --> show replay button.
 ** 4. On replay button click --> reset game to play again.
 *
 */
//** Main */
(() => {
  //bind click event for all li element
  initCellElementList();
  //bind click event for replay button
  initReplayButton();
})();
