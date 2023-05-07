import React, { Fragment } from "react";
import { Button } from "@material-ui/core";
import { NavLink, useLocation } from "react-router-dom";
import { Home, HomeOutlined, Person, PersonOutlined } from "@material-ui/icons";

import useStyles from "./styles";

const MiddleMenu = () => {
    const classes = useStyles();
    const location = useLocation();

    return (
        <Fragment>
            <Button
                to="/home"
                component={NavLink}
                activeClassName={classes.activeBtn}
                className={classes.buttonItemMiddle}
            >
                {location.pathname === "/home" ? (
                    <Home
                        fontSize="large"
                        style={{
                            color: "rgb(0,133,243)",
                        }}
                    />
                ) : (
                    <HomeOutlined fontSize="large" />
                )}
            </Button>
            <Button
                to="/friends"
                component={NavLink}
                activeClassName={classes.activeBtn}
                className={classes.buttonItemMiddle}
            >
                {location.pathname === "/friends" ? (
                    <Person fontSize="large" style={{ color: "rgb(0,133,243)" }} />
                ) : (
                    <PersonOutlined fontSize="large" />
                )}
            </Button>
        </Fragment>
    );
};

export default MiddleMenu;
