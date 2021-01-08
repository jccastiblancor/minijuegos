import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import io from "socket.io-client";

import Tile from "./Tile";

const socket = io.connect("http://localhost:4000");

if (process.env.NODE_ENV === "production") {
  var proxy = require("socket.io-proxy");
  var socket = proxy.connect(
    "http://https://shrouded-taiga-82868.herokuapp.com/"
  );
}

const Board = () => {
  const [player, setPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [board, setBoard] = useState(null);
  const [walls, setWalls] = useState(null);
  const [winner, setWinner] = useState(null);

  /**
   * Initialize the board and sets the starting player randomly
   */
  const startGame = () => {
    let b = new Array(9);
    b[0] = [0, 0, 0, 0, 1, 0, 0, 0, 0];
    b[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    b[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    b[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    b[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    b[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    b[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    b[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    b[8] = [0, 0, 0, 0, 2, 0, 0, 0, 0];
    setBoard(b);
    setWinner(null);
  };

  /**
   * End the game, set a winner and finishes the plays.
   */
  const endGame = () => {
    setWinner(currentPlayer);
    emitPlay(null);
  };

  useEffect(() => {
    socket.on("play", ({ currentPlayer, board }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    });
    socket.on("hello", (player) => {
      setPlayer(player);
    });
    socket.on("start", (startTingPlayer) => {
      startGame();
      setCurrentPlayer(startTingPlayer);
    });
  }, []);

  /**
   * sends movement to socket
   */
  const emitPlay = (cPlayer) => {
    socket.emit("play", { currentPlayer: cPlayer, board: board });
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
        if (copy[i][j] === 3 || copy[i][j] === 4) copy[i][j] = 0;
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
        if (copy[i][j] === currentPlayer) copy[i][j] = 0;
      }
    }
    setBoard(copy);
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
      if (x > 0) {
        if (copy[x - 1][y] === 0 && x === 1 && currentPlayer === 2) {
          copy[x - 1][y] = 4;
        }
        if (copy[x - 1][y] === 0) copy[x - 1][y] = 3;
        if (copy[x - 1][y] === rival() && x > 1) copy[x - 2][y] = 3;
      }
      if (x < 8) {
        if (copy[x + 1][y] === 0 && x === 7 && currentPlayer === 1) {
          copy[x + 1][y] = 4;
        }
        if (copy[x + 1][y] === 0) copy[x + 1][y] = 3;
        if (copy[x + 1][y] === rival() && x < 7) copy[x + 2][y] = 3;
      }
      if (y > 0) {
        if (copy[x][y - 1] === 0) copy[x][y - 1] = 3;
        if (copy[x][y - 1] === rival() && y > 1) copy[x][y - 2] = 3;
      }
      if (y < 8) {
        if (copy[x][y + 1] === 0) copy[x][y + 1] = 3;
        if (copy[x][y + 1] === rival() && y < 7) copy[x][y + 2] = 3;
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
    copy[x][y] = currentPlayer;
    setBoard(copy);

    emitPlay(rival());
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
                    info={tile}
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

  return (
    <div>
      {renderBoard()}
      <hr />
      {player > 2 ? <p>You are a viewer</p> : <p>You are player : {player}</p>}

      {winner ? (
        <p>player {winner} wins !</p>
      ) : (
        <p> current player: {currentPlayer}</p>
      )}

      {winner ? <p onClick={startGame}>Play again</p> : null}
    </div>
  );
};

export default Board;
