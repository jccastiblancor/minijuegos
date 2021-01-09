import React from "react";
import { Grid } from "@material-ui/core";

import Board from "./Board";

const Quoridor = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={1} lg={2} />
      <Grid item xs={10} lg={6}>
        <Board />
      </Grid>
      <Grid item xs={1} lg={2} />
      <Grid item xs>
        <h1>Quoridor</h1>
        <p>
          Instrucciones: pfff quien necesita esto te voy a destruir amor jeje
        </p>
        <p>
          Faltan algnas reglas para indicar si se puede o no colocar la barrera
          y también bloquear el movimiento de acuerdo a las barreras.
        </p>
      </Grid>
    </Grid>
  );
};

export default Quoridor;
