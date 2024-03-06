import React from "react";
import { Paper, CircularProgress } from "@material-ui/core";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        minWidth: "100vw",
        minHeight: "100vh",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Paper elevation={14} style={{ padding: "16px" }}>
        <CircularProgress />
      </Paper>
    </div>
  );
};

export default Loading;
