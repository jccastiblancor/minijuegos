import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import io from "socket.io-client";

import Tile from "./Tile";
import Wall from "./Wall";

let socket = io.connect();

const Board = () => {
  const [player, setPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [board, setBoard] = useState(null);
  const [walls, setWalls] = useState(0);
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
        if (copy[x - 1][y].board === 0 && x === 1 && currentPlayer === 2) {
          copy[x - 1][y].board = 4;
        }
        if (copy[x - 1][y].board === 0) copy[x - 1][y].board = 3;
        if (copy[x - 1][y].board === rival() && x > 1) copy[x - 2][y].board = 3;
        if (
          copy[x - 1][y].board === rival() &&
          x === 2 &&
          currentPlayer === 2
        ) {
          copy[x - 2][y].board = 4;
        }
      }
      if (x < 8) {
        if (copy[x + 1][y].board === 0 && x === 7 && currentPlayer === 1) {
          copy[x + 1][y].board = 4;
        }
        if (copy[x + 1][y].board === 0) copy[x + 1][y].board = 3;
        if (copy[x + 1][y].board === rival() && x < 7) copy[x + 2][y].board = 3;
        if (
          copy[x + 1][y].board === rival() &&
          x === 6 &&
          currentPlayer === 1
        ) {
          copy[x + 2][y].board = 4;
        }
      }
      if (y > 0) {
        if (copy[x][y - 1].board === 0) copy[x][y - 1].board = 3;
        if (copy[x][y - 1].board === rival() && y > 1) copy[x][y - 2].board = 3;
      }
      if (y < 8) {
        if (copy[x][y + 1].board === 0) copy[x][y + 1].board = 3;
        if (copy[x][y + 1].board === rival() && y < 7) copy[x][y + 2].board = 3;
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

    setBoard(copy);
    setWalls(walls - 1);
    setWallToPlace(null);
    emitPlay(rival());
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

          {winner ? <p onClick={setGame}>Rematch</p> : null}
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
