import { Paper, Typography } from "@material-ui/core";
import React, { useState, Fragment, useContext } from "react";

import PostDialog from "./PostDialog";
import AvatarIcon from "../UI/AvatarIcon";
import { UIContext, UserContext } from "../../App";

const PostBar = () => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { uiState } = useContext(UIContext);

    const [isOpenPostDialog, setIsOpenPostDialog] = useState(false);

    return (
        <Fragment>
            <Paper
                style={{
                    display: "flex",
                    padding: "20px",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    backgroundColor: uiState.darkMode && "rgb(36,37,38)",
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
                            background: uiState.darkMode ? null : "rgb(244,245,246)",
                        }}
                        onClick={() => setIsOpenPostDialog(true)}
                    >
                        What's in your mind, {currentUser?.name}?
                    </Typography>
                    <PostDialog
                        isOpen={isOpenPostDialog}
                        setIsOpenPostDialog={setIsOpenPostDialog}
                    />
                </div>
            </Paper>
        </Fragment>
    );
};

export default PostBar;
