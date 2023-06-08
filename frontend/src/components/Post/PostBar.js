import { Paper, Typography } from "@material-ui/core";
import React, { useState, Fragment, useContext } from "react";

import PostDialog from "./PostDialog";
import AvatarIcon from "../UI/AvatarIcon";
import { UIContext, UserContext } from "../../App";

const PostBar = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const [isOpenPostDialog, setIsOpenPostDialog] = useState(false);

    return (
        <Fragment>
            <Paper
                style={{
                    display: "flex",
                    padding: "20px",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    backgroundColor: darkMode && "rgb(36,37,38)",
                }}
            >
                <AvatarIcon text={currentUser?.name} imageUrl={currentUser?.avatar_image} />
                <div style={{ width: "100%", marginLeft: "16px" }}>
                    <Typography
                        style={{
                            color: "grey",
                            cursor: "pointer",
                            borderRadius: "16px",
                            padding: "10px 20px",
                            background: darkMode ? null : "rgb(244,245,246)",
                        }}
                        onClick={() => setIsOpenPostDialog(true)}
                    >
                        What's in your mind, {currentUser?.name}?
                    </Typography>
                    <PostDialog isOpen={isOpenPostDialog} setIsOpen={setIsOpenPostDialog} />
                </div>
            </Paper>
        </Fragment>
    );
};

export default PostBar;
