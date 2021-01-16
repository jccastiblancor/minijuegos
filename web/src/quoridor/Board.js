import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import io from "socket.io-client";

import Tile from "./Tile";

let socket = io.connect();

const Board = () => {
  const [player, setPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [board, setBoard] = useState(null);
  const [walls, setWalls] = useState(0);
  const [totalWalls, setTotalWalls] = useState(0);
  const [winner, setWinner] = useState(null);
  const [wallToPlace, setWallToPlace] = useState(null);

  /**
   * Initialize the board and sets the player walls to 10
   */
  const setGame = () => {
    let copy = new Array(9).fill(0).map((o, i) => new Array(9).fill(0));
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (i === 0 && j === 4) {
          copy[i][j] = { board: 1, wallBoard: 0 }; // Player 1 Tile
        } else if (i === 8 && j === 4) {
          copy[i][j] = { board: 2, wallBoard: 0 }; // Player 2 Tile
        } else {
          copy[i][j] = { board: 0, wallBoard: 0 }; // Default Tile
        }
      }
    }

    setBoard(copy);
    setWinner(null);
    setWalls(10);
    setTotalWalls(20);
  };

  /**
   * End the game, set a winner and finishes the plays.
   */
  const endGame = () => {
    setWinner(currentPlayer);
    emitPlay(null, totalWalls);
  };

  useEffect(() => {
    socket.on("play", ({ currentPlayer, board, walls }) => {
      setTotalWalls(walls);
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    });
    socket.on("hello", (player) => {
      setGame();
      setPlayer(player);
    });
    socket.on("start", (startTingPlayer) => {
      setCurrentPlayer(startTingPlayer);
    });
  }, []);

  /**
   * sends movement to socket
   * @param {*} cPlayer current player
   */
  const emitPlay = (cPlayer, walls) => {
    socket.emit("play", {
      currentPlayer: cPlayer,
      board: board,
      walls: walls,
    });
    setCurrentPlayer(cPlayer);
  };

  /**
   * Gives the rival
   */
  const rival = () => {
    if (currentPlayer === 2) {
      return 1;
    } else {
      return 2;
    }
  };

  /**
   * Clean the tiles marked as posible movements
   */
  const cleanMoveTiles = () => {
    let copy = [...board];
    for (var i = 0; i < copy.length; i++) {
      for (var j = 0; j < copy.length; j++) {
        if (copy[i][j].board === 3 || copy[i][j].board === 4)
          copy[i][j].board = 0;
      }
    }
    setBoard(copy);
  };

  /**
   * Clears the current player tile
   */
  const cleanCurrentPlayer = () => {
    let copy = [...board];
    for (var i = 0; i < copy.length; i++) {
      for (var j = 0; j < copy.length; j++) {
        if (copy[i][j].board === currentPlayer) copy[i][j].board = 0;
      }
    }
    setBoard(copy);
  };

  const canMove = (direction, x, y) => {
    switch (direction) {
      case "up":
        return ![1, 3, 5, 7, 9, 11, 13, 15].includes(board[x][y].wallBoard);
      case "down":
        return ![2, 3, 6, 7, 10, 11, 14, 15].includes(board[x][y].wallBoard);
      case "left":
        return ![4, 5, 6, 7, 12, 13, 14, 15].includes(board[x][y].wallBoard);
      case "right":
        return ![8, 9, 10, 11, 12, 13, 14, 15].includes(board[x][y].wallBoard);
      default:
        return null;
    }
  };
  /**
   * Shows the posible movement options
   * @param {*} selected indicates if the peon was selected
   * @param {*} x x position of the peon
   * @param {*} y y position of the peon
   */
  const readyToMove = (selected, x, y) => {
    let copy = [...board];
    if (selected) {
      if (x > 0 && canMove("up", x, y)) {
        if (copy[x - 1][y].board === rival()) {
          // rival is up
          if (canMove("up", x - 1, y)) {
            if (x > 1) {
              copy[x - 2][y].board = 3; //tile is free
            }
            if (x === 2 && currentPlayer === 2) {
              copy[x - 2][y].board = 4; // winnig tile
            }
          } else {
            if (canMove("right", x - 1, y) && y < 8) {
              copy[x - 1][y + 1].board = 3; //tile is free
            }
            if (canMove("left", x - 1, y) && y > 0) {
              copy[x - 1][y - 1].board = 3; //tile is free
            }
          }
        } else {
          if (copy[x - 1][y].board === 0 && x === 1 && currentPlayer === 2) {
            copy[x - 1][y].board = 4; // winning tile
          } else if (copy[x - 1][y].board === 0) {
            copy[x - 1][y].board = 3; // tile is empty
          }
        }
      }
      if (x < 8 && canMove("down", x, y)) {
        if (copy[x + 1][y].board === rival()) {
          if (canMove("down", x + 1, y)) {
            if (x < 7) {
              copy[x + 2][y].board = 3; //tile is free
            }
            if (x === 6 && currentPlayer === 2) {
              copy[8][y].board = 4; // winnig tile
            }
          } else {
            if (canMove("right", x + 1, y) && y < 8) {
              copy[x + 1][y + 1].board = 3; //tile is free
            }
            if (canMove("left", x + 1, y) && y > 0) {
              copy[x + 1][y - 1].board = 3; //tile is free
            }
          }
        } else {
          if (copy[8][y].board === 0 && x === 7 && currentPlayer === 1) {
            copy[8][y].board = 4; // winning tile
          } else if (copy[x + 1][y].board === 0) {
            copy[x + 1][y].board = 3; // tile is empty
          }
        }
      }
      if (y > 0 && canMove("left", x, y)) {
        if (copy[x][y - 1].board === rival()) {
          if (canMove("left", x, y - 1)) {
            if (y > 1) {
              copy[x][y - 2].board = 3; //tile is free
            }
          } else {
            if (canMove("up", x, y - 1) && x > 0) {
              copy[x - 1][y - 1].board = 3; //tile is free
            }
            if (canMove("down", x, y - 1) && x < 8) {
              copy[x + 1][y - 1].board = 3; //tile is free
            }
          }
        } else {
          if (copy[x][y - 1].board === 0) copy[x][y - 1].board = 3;
        }
      }
      if (y < 8 && canMove("right", x, y)) {
        if (copy[x][y - 1].board === rival()) {
          if (canMove("right", x, y + 1)) {
            if (y < 7) {
              copy[x][y + 1].board = 3; //tile is free
            }
          } else {
            if (canMove("up", x, y + 1) && x > 0) {
              copy[x - 1][y + 1].board = 3; //tile is free
            }
            if (canMove("down", x, y + 1) && x < 8) {
              copy[x + 1][y + 1].board = 3; //tile is free
            }
          }
        } else {
          if (copy[x][y + 1].board === 0) copy[x][y + 1].board = 3;
        }
      }
    } else {
      cleanMoveTiles();
    }
    setBoard(copy);
  };

  /**
   * Moves the peon to the given position
   * @param {*} x x new coordinate of the peon
   * @param {*} y y new coordinate of the peon
   */
  const moveTo = (x, y) => {
    cleanMoveTiles();
    cleanCurrentPlayer();

    let copy = [...board];
    copy[x][y].board = currentPlayer;
    setBoard(copy);

    emitPlay(rival(), totalWalls);
  };

  /**
   * Renders the Quoridor Board, by placing 9 rows and colummns and giving each tile a diferent state (info)
   */
  const renderBoard = () => {
    if (board) {
      return board.map((row, x) => {
        return (
          <Grid
            container
            spacing={0}
            key={x}
            className={`${winner ? "winner-board" : null}`}
          >
            {row.map((tile, y) => {
              return (
                <Grid item xs key={y}>
                  <Tile
                    info={tile.board}
                    walls={tile.wallBoard}
                    wallToPlace={wallToPlace}
                    placeWall={placeWall}
                    readyToMove={readyToMove}
                    moveTo={moveTo}
                    x={x}
                    y={y}
                    currentPlayer={currentPlayer}
                    endGame={endGame}
                    player={player}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      });
    }
    return null; // change to spiner
  };

  const placeWall = (x, y) => {
    let copy = [...board];
    if (wallToPlace === "vertical") {
      copy[x][y].wallBoard += 8;
      copy[x + 1][y].wallBoard += 8;
      copy[x][y + 1].wallBoard += 4;
      copy[x + 1][y + 1].wallBoard += 4;
    } else {
      copy[x][y].wallBoard += 2;
      copy[x][y + 1].wallBoard += 2;
      copy[x + 1][y].wallBoard += 1;
      copy[x + 1][y + 1].wallBoard += 1;
    }
    cleanMoveTiles();
    setBoard(copy);
    setWalls(walls - 1);
    setWallToPlace(null);
    emitPlay(rival(), totalWalls - 1);
  };

  return (
    <div>
      {renderBoard()}
      <hr />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {player > 2 ? (
            <p>You are a viewer</p>
          ) : (
            <p>You are the player : {player}</p>
          )}

          {winner ? (
            <p>player {winner} wins !</p>
          ) : (
            <p> current player: {currentPlayer}</p>
          )}

          <p>You have {walls} walls left</p>
          <p>Rival have {totalWalls - walls} walls left</p>

          {winner ? (
            <p onClick={setGame} className="clickable">
              Rematch
            </p>
          ) : null}
          {currentPlayer ? null : (
            <p onClick={setGame} className="clickable">
              You lost! Rematch
            </p>
          )}
        </Grid>
        <Grid item xs>
          {walls === 0 ? null : (
            <Grid container spacing={2}>
              <Grid item xs>
                <div
                  className={`p${player} ${
                    wallToPlace === "vertical" ? "select-wall" : null
                  } wall`}
                  onClick={() => {
                    if (player === currentPlayer) {
                      setWallToPlace("vertical");
                    }
                    if (wallToPlace === "vertical") {
                      setWallToPlace(null);
                    }
                  }}
                />
              </Grid>
              <Grid item xs>
                <div
                  className={`p${player} ${
                    wallToPlace === "horizontal" ? "select-wall" : null
                  } horizontal-wall`}
                  onClick={() => {
                    if (player === currentPlayer) {
                      setWallToPlace("horizontal");
                    }
                    if (wallToPlace === "horizontal") {
                      setWallToPlace(null);
                    }
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Board;
