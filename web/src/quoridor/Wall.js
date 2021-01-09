import React, { useState } from "react";

const Wall = ({ horizontal, player, currentPlayer, setWallToPlace }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={`p${player} ${selected ? "select-wall" : null} ${
        horizontal ? "horizontal-wall" : "wall"
      }`}
      onClick={() => {
        if (player === currentPlayer) {
          setSelected(!selected);
        }
      }}
    />
  );
};

export default Wall;
