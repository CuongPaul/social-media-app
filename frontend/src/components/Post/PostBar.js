import { Paper, Typography } from "@material-ui/core";
import React, { Fragment, useContext } from "react";

import PostDialog from "./PostDialog";
import AvatarIcon from "../UI/AvatarIcon";
import { UIContext, UserContext } from "../../App";

const PostBar = () => {
    const { userState } = useContext(UserContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    return (
        <Fragment>
            <Paper
                style={{
                    padding: "16px",
                    maxWidth: "100%",
                    backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <AvatarIcon
                        text={userState.currentUser.name}
                        imageUrl={userState.currentUser.avatar_image}
                    />
                    <div style={{ width: "100%", marginLeft: "16px", marginRight: "16px" }}>
                        <Typography
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderRadius: "20px",
                                color: uiState.darkMode ? null : "grey",
                                background: uiState.darkMode ? null : "rgb(240,242,245)",
                            }}
                            onClick={() => uiDispatch({ type: "SET_POST_MODEL", payload: true })}
                        >
                            What's in your mind, {userState.currentUser.name}?
                        </Typography>{" "}
                        <PostDialog />
                    </div>
                </div>
            </Paper>
        </Fragment>
    );
};

export default PostBar;
