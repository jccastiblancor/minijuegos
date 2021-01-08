import React, { useState, useEffect } from "react";

const Tile = ({
  info,
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
  }, [info]);

  const clickPeon = (p, x, y) => {
    if (p === currentPlayer && p === player) {
      setClicked(!clicked);
      readyToMove(!clicked, x, y);
    }
  };

  const tileP1 = () => {
    return (
      <div className={`${clicked ? "clicked-tile" : null} box`}>
        <span
          className="peon p1"
          onClick={() => {
            clickPeon(1, x, y);
          }}
        >
          1
        </span>
      </div>
    );
  };

  const tileP2 = () => {
    return (
      <div className={`${clicked ? "clicked-tile" : null} box`}>
        <span
          className="peon p2"
          onClick={() => {
            clickPeon(2, x, y);
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
        className="option-tile box"
        onClick={() => {
          moveTo(x, y);
        }}
      />
    );
  };

  const tileVictory = () => {
    return (
      <div
        className="victory-tile box"
        onClick={() => {
          moveTo(x, y);
          endGame();
        }}
      />
    );
  };

  const defaultTile = () => {
    //setClicked(false);
    return <div className="box" />;
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
