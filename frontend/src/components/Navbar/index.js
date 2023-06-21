import React, { useContext } from "react";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { Home, Person, HomeOutlined, PersonOutlined } from "@material-ui/icons";

import Account from "./Account";
import Actions from "./Actions";
import Messenger from "./Messenger";
import CreatePost from "./CreatePost";
import { UIContext } from "../../App";
import SearchUsers from "./SearchUsers";
import Notifications from "./Notifications";

const Navbar = () => {
    const {
        uiState: { darkMode, isMobileScreen },
    } = useContext(UIContext);

    const history = useHistory();
    const { pathname } = useLocation();

    console.log("isMobileScreen: ", isMobileScreen);

    return (
        <AppBar
            style={{
                color: darkMode ? "rgb(228,230,235)" : "rgb(5,5,5)",
                backgroundColor: darkMode ? "rgb(36,37,38)" : "rgb(255,255,255)",
            }}
        >
            <Toolbar>
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon
                        icon={faFacebook}
                        style={{
                            width: "45px",
                            height: "45px",
                            cursor: "pointer",
                            color: "rgb(10,128,236)",
                        }}
                        onClick={() => history.push("/home")}
                    />
                    <SearchUsers />
                </div>
                <div
                    style={{
                        flex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        to="/home"
                        component={NavLink}
                        style={{
                            padding: "10px 50px",
                            borderBottom: pathname === "/home" && "5px solid rgb(27,116,228)",
                        }}
                    >
                        {pathname === "/home" ? (
                            <Home fontSize="large" style={{ color: "rgb(27,116,228)" }} />
                        ) : (
                            <HomeOutlined
                                fontSize="large"
                                style={{
                                    color: darkMode ? "rgb(177,179,185)" : "rgb(101,103,107)",
                                }}
                            />
                        )}
                    </Button>
                    <Button
                        to="/friends"
                        component={NavLink}
                        style={{
                            padding: "10px 50px",
                            borderBottom: pathname === "/friends" && "5px solid rgb(27,116,228)",
                        }}
                    >
                        {pathname === "/friends" ? (
                            <Person fontSize="large" style={{ color: "rgb(27,116,228)" }} />
                        ) : (
                            <PersonOutlined
                                fontSize="large"
                                style={{
                                    color: darkMode ? "rgb(177,179,185)" : "rgb(101,103,107)",
                                }}
                            />
                        )}
                    </Button>
                </div>
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                    }}
                >
                    <Account />
                    <CreatePost />
                    <Messenger />
                    <Notifications />
                    <Actions />
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
