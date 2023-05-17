import React, { useContext } from "react";
import { Close } from "@material-ui/icons";
import { CardHeader, IconButton, Typography, DialogContent } from "@material-ui/core";

import { UserContext } from "../../../../App";
import AvatarIcon from "../../../UI/AvatarIcon";

const DialogHeader = ({ postBody, handleCloseDialog }) => {
    const { userState } = useContext(UserContext);

    return (
        <div>
            <CardHeader
                action={
                    <IconButton onClick={() => handleCloseDialog()}>
                        <Close />
                    </IconButton>
                }
                avatar={
                    <AvatarIcon
                        text={userState.currentUser.name}
                        imageUrl={userState.currentUser.avatar_image}
                    />
                }
                title={
                    <Typography style={{ fontWeight: 800, fontSize: "16px" }}>
                        {userState.currentUser.name}
                    </Typography>
                }
            />
            <DialogContent>
                <Typography>
                    <b>{postBody && userState.currentUser.name}</b>
                    {postBody?.feelings ? (
                        <>
                            &nbsp; is feeling <b>{postBody.feelings}</b>
                        </>
                    ) : null}
                    {postBody?.tag_friends.length ? (
                        <>
                            {" with"}
                            <b>
                                {postBody?.tag_friends.map((friend, index) => (
                                    <>
                                        {" "}
                                        &nbsp;{friend.name}
                                        {index < postBody.tag_friends.length - 1 && ","}
                                    </>
                                ))}
                            </b>
                        </>
                    ) : null}
                    {postBody?.location ? (
                        <>
                            {` at `} <b>{postBody?.location} </b>
                        </>
                    ) : null}
                </Typography>
            </DialogContent>
        </div>
    );
};

export default DialogHeader;
