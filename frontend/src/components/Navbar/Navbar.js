import React, { useContext } from "react";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Toolbar, useMediaQuery, useTheme } from "@material-ui/core";

import useStyles from "./styles";
import RightMenu from "./RightMenu";
import { UIContext } from "../../App";
import MiddleMenu from "./MiddleMenu";
import SearchUsers from "../Friends/SearchUsers";

const Navbar = () => {
    const { uiState } = useContext(UIContext);

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
                color: uiState.darkMode ? null : "blue",
                backgroundColor: uiState.darkMode ? "rgb(36,37,38)" : "white",
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
                    <SearchUsers />
                </div>
                <div className={classes.middleMenu}>
                    <MiddleMenu />
                </div>
                <div className={classes.rightMenu}>
                    <RightMenu />
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
