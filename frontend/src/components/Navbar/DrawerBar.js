import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";

import { UIContext } from "../../App";

const drawerWidth = "100vw";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
    },

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: (darkMode) => ({
        width: drawerWidth,
        backgroundColor: darkMode && "rgb(36,37,38)",
    }),
}));

const DrawerBar = ({ children }) => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const classes = useStyles(uiState.darkMode);

    return (
        <div className={classes.root}>
            <Drawer
                variant="persistent"
                open={uiState.drawer}
                className={classes.drawer}
                classes={{ paper: classes.drawerPaper }}
                onClose={() => uiDispatch({ type: "SET_DRAWER", payload: false })}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>{children}</div>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => uiDispatch({ type: "SET_DRAWER", payload: !uiState.drawer })}
                >
                    Close
                </Button>
            </Drawer>
        </div>
    );
};

export default DrawerBar;
