import React, { useState, useEffect } from "react";

const Tile = ({
  info,
  walls,
  wallToPlace,
  placeWall,
  readyToMove,
  moveTo,
  x,
  y,
  currentPlayer,
  endGame,
  player,
}) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, [info, walls]);

  const clickPeon = (p, x, y) => {
    if (p === currentPlayer && p === player) {
      setClicked(!clicked);
      readyToMove(!clicked, x, y);
    }
  };

  const doNothing = () => {};

  const tileP1 = () => {
    return (
      <div
        className={`${
          clicked ? "clicked-tile" : null
        } box ${wallTile()} ${placedWall()}`}
        onClick={() => {
          wallToPlace !== null ? placeWall(x, y) : doNothing();
        }}
      >
        <span
          className="peon p1"
          onClick={() => {
            wallToPlace !== null ? doNothing() : clickPeon(1, x, y);
          }}
        >
          1
        </span>
      </div>
    );
  };

  const tileP2 = () => {
    return (
      <div
        className={`${
          clicked ? "clicked-tile" : null
        } box ${wallTile()} ${placedWall()}`}
        onClick={() => {
          wallToPlace !== null ? placeWall(x, y) : doNothing();
        }}
      >
        <span
          className="peon p2"
          onClick={() => {
            wallToPlace !== null ? doNothing() : clickPeon(2, x, y);
          }}
        >
          2
        </span>
      </div>
    );
  };

  const tileMove = () => {
    return (
      <div
        className={`option-tile box ${placedWall()}`}
        onClick={() => {
          moveTo(x, y);
        }}
      />
    );
  };

  const tileVictory = () => {
    return (
      <div
        className={`victory-tile box ${placedWall()}`}
        onClick={() => {
          moveTo(x, y);
          endGame();
        }}
      />
    );
  };

  const defaultTile = () => {
    //setClicked(false);
    return (
      <div
        className={`box ${wallTile()} ${placedWall()}`}
        onClick={() => {
          wallToPlace !== null ? placeWall(x, y) : doNothing();
        }}
      />
    );
  };

  const placedWall = () => {
    switch (walls) {
      case 0:
        return null;
      case 1:
        return "wall-up";
      case 2:
        return "wall-down";
      case 3:
        return "wall-up wall-down";
      case 4:
        return "wall-left";
      case 5:
        return "wall-left wall-up";
      case 6:
        return "wall-left wall-down";
      case 7:
        return "wall-left wall-up wall-down";
      case 8:
        return "wall-right";
      case 9:
        return "wall-right wall-up";
      case 10:
        return "wall-right wall-down";
      case 11:
        return "wall-right wall-up wall-down";
      case 12:
        return "wall-right wall-left";
      case 13:
        return "wall-right wall-left wall-up";
      case 14:
        return "wall-right wall-left wall-down";
      case 15:
        return "wall-right wall-left wall-up wall-down";
      default:
        return null;
    }
  };

  const wallTile = () => {
    switch (wallToPlace) {
      case "vertical":
        return "hover-right-box";
      case "horizontal":
        return "hover-bottom-box";
      default:
        return null;
    }
  };

  switch (info) {
    case 0:
      return defaultTile();
    case 1:
      return tileP1();
    case 2:
      return tileP2();
    case 3:
      return tileMove();
    case 4:
      return tileVictory();
    default:
      return null;
  }
};

export default Tile;
