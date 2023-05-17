import React, { useState } from "react";
import { Paper, Dialog, Typography, LinearProgress } from "@material-ui/core";

const DialogLoading = ({ loading, text }) => {
    const [isOpen, setIsOpen] = useState(loading);

    return (
        <Dialog fullWidth open={isOpen} style={{ width: "100%" }} onClose={() => setIsOpen(false)}>
            <Paper
                elevation={15}
                style={{
                    width: "100%",
                    height: "100%",
                    padding: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <Typography
                    style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        marginBottom: "16px",
                    }}
                >
                    {text}
                </Typography>
                <LinearProgress color="secondary" style={{ width: "50%" }} />
            </Paper>
        </Dialog>
    );
};

export default DialogLoading;
