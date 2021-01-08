import React from "react";
import Grid from "@material-ui/core/Grid";

import Board from "./Board";
import "./App.css";

function App() {
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
        <p>Faltan paredes, sockets para el movimiento de las fichas</p>
      </Grid>
    </Grid>
  );
}

export default App;
