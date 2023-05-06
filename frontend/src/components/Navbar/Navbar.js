import React, { useContext } from "react";
import { Menu as MenuIcon } from "@material-ui/icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Toolbar, IconButton, useMediaQuery, useTheme, Tooltip } from "@material-ui/core";

import useStyles from "./styles";
import RightMenu from "./RightMenu";
import { UIContext } from "../../App";
import MiddleMenu from "./MiddleMenu";
import SearchFriends from "../Friends/SearchFriends";

const Navbar = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const classes = useStyles();
    const { breakpoints } = useTheme();
    const xsScreen = useMediaQuery(breakpoints.only("xs"));

    return (
        <AppBar
            elevation={1}
            color="default"
            className={classes.root}
            style={{
                zIndex: "10000",
                color: !uiState.darkMode ? "blue" : null,
                backgroundColor: !uiState.darkMode ? "white" : "rgb(36,37,38)",
            }}
        >
            <Toolbar>
                <div className={classes.leftMenu}>
                    <FontAwesomeIcon
                        icon={faFacebook}
                        size={xsScreen ? "xs" : "2x"}
                        style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "8px",
                            color: uiState.darkMode ? null : "rgb(0,133,243)",
                        }}
                    />
                    <SearchFriends />
                    {!uiState.mdScreen && uiState.navDrawerMenu && (
                        <Tooltip
                            arrow
                            title={
                                uiState.drawer ? "Click to close drawer " : " Click to open drawer"
                            }
                        >
                            <IconButton
                                onClick={() => {
                                    uiDispatch({ type: "SET_DRAWER", payload: !uiState.drawer });
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
                {uiState.mdScreen && (
                    <div className={classes.middleMenu}>
                        <MiddleMenu />
                    </div>
                )}
                <div className={classes.rightMenu}>
                    <RightMenu />
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
