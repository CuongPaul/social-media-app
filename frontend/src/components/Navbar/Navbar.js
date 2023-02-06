import React, { Fragment, useContext } from "react";
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

    const theme = useTheme();
    const classes = useStyles();
    const xsScreen = useMediaQuery(theme.breakpoints.only("xs"));

    return (
        <Fragment>
            <AppBar
                color="default"
                style={{
                    backgroundColor: !uiState.darkMode ? "white" : "rgb(36,37,38)",
                    color: !uiState.darkMode ? "blue" : null,
                    zIndex: "10000",
                }}
                className={classes.root}
                elevation={1}
            >
                <Toolbar>
                    <div className={classes.leftMenu}>
                        <FontAwesomeIcon
                            icon={faFacebook}
                            size={xsScreen ? "xs" : "2x"}
                            style={{
                                width: "40px",
                                height: "40px",
                                color: !uiState.darkMode ? "rgb(0,133,243)" : null,
                                marginRight: "8px",
                            }}
                        />

                        <SearchFriends />

                        {!uiState.mdScreen && uiState.navDrawerMenu && (
                            <Tooltip
                                title={
                                    uiState.drawer
                                        ? "click to close drawer "
                                        : " click to open drawer"
                                }
                                arrow
                            >
                                <IconButton
                                    onClick={() =>
                                        uiDispatch({ type: "SET_DRAWER", payload: !uiState.drawer })
                                    }
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
        </Fragment>
    );
};

export default Navbar;
