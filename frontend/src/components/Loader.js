import React from "react";
import { Paper, CircularProgress } from "@material-ui/core";

const Loader = () => {
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
            <Paper style={{ padding: "16px" }} elevation={14}>
                <CircularProgress />
            </Paper>
        </div>
    );
};

export default Loader;
