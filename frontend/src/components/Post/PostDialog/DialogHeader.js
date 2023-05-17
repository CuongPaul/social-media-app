import React, { Fragment } from "react";
import { Close } from "@material-ui/icons";
import { CardHeader, IconButton, Typography, DialogContent } from "@material-ui/core";

import AvatarIcon from "../../UI/AvatarIcon";
import PostSubContent from "../PostSubContent";

const DialogHeader = ({ user, postBody, handleCloseDialog }) => {
    return (
        <Fragment>
            <CardHeader
                action={
                    <IconButton onClick={handleCloseDialog}>
                        <Close />
                    </IconButton>
                }
                title={
                    <Typography style={{ fontWeight: 800, fontSize: "16px" }}>
                        {user.name}
                    </Typography>
                }
                avatar={<AvatarIcon text={user.name} imageUrl={user.avatar_image} />}
            />
            <DialogContent>
                <PostSubContent postBody={postBody} username={user.name} />
            </DialogContent>
        </Fragment>
    );
};

export default DialogHeader;
