import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

import Quoridor from "./quoridor/Quoridor";
import "./App.css";

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Malstle</Typography>
        </Toolbar>
      </AppBar>
      <br />
      <Quoridor />
    </>
  );
}

export default App;
