import React, { useContext } from "react";
import { BottomNavigation, Paper } from "@material-ui/core";

import MiddleMenu from "./MiddleMenu";
import { UIContext } from "../../App";

const BottomNav = () => {
    const { uiState } = useContext(UIContext);
    return (
        <Paper elevation={0} style={{ width: "100%", position: "fixed", bottom: 0, zIndex: 3 }}>
            <BottomNavigation
                style={{
                    width: "100%",
                    display: "flex",
                    padding: "8px 0px",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    background: uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)",
                }}
            >
                <MiddleMenu />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;
