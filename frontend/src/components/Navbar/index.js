import React, { useContext } from "react";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { Home, Person, HomeOutlined, PersonOutlined } from "@material-ui/icons";

import { UIContext } from "../../App";
import AccountMenu from "./AccountMenu";
import ProfileMenu from "./ProfileMenu";
import MessengerMenu from "./MessengerMenu";
import CreatePostMenu from "./CreatePostMenu";
import SearchUsers from "../Friends/SearchUsers";
import NotificationMenu from "./NotificationMenu";

const Navbar = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);

    const history = useHistory();
    const location = useLocation();

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
                            marginRight: "12px",
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
                            borderBottom:
                                location.pathname === "/home" && "5px solid rgb(27,116,228)",
                        }}
                    >
                        {location.pathname === "/home" ? (
                            <Home fontSize="large" style={{ color: "rgb(27,116,228)" }} />
                        ) : (
                            <HomeOutlined fontSize="large" />
                        )}
                    </Button>
                    <Button
                        to="/friends"
                        component={NavLink}
                        style={{
                            padding: "10px 50px",
                            borderBottom:
                                location.pathname === "/friends" && "5px solid rgb(27,116,228)",
                        }}
                    >
                        {location.pathname === "/friends" ? (
                            <Person fontSize="large" style={{ color: "rgb(27,116,228)" }} />
                        ) : (
                            <PersonOutlined fontSize="large" />
                        )}
                    </Button>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <AccountMenu />
                    <CreatePostMenu />
                    <MessengerMenu />
                    <NotificationMenu />
                    <ProfileMenu />
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
