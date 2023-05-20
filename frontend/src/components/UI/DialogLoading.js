import React from "react";
import { Paper, Dialog, Typography, LinearProgress } from "@material-ui/core";

const DialogLoading = ({ text, loading }) => {
    return (
        <Dialog fullWidth open={loading} style={{ width: "100%" }}>
            <Paper
                style={{
                    display: "flex",
                    padding: "32px 0px",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <Typography
                    style={{
                        fontWeight: 800,
                        fontSize: "20px",
                        marginBottom: "16px",
                    }}
                >
                    {text}
                </Typography>
                <LinearProgress color="secondary" style={{ width: "75%" }} />
            </Paper>
        </Dialog>
    );
};

export default DialogLoading;
