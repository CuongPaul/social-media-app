import React, { useContext } from "react";
import { Close } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";

import AvatarIcon from "./AvatarIcon";
import { ChatContext } from "../../App";
import { pauseAudio } from "../../utils/audio";

const VideoCallNotifications = () => {
    const {
        chatDispatch,
        chatState: { videoCall },
    } = useContext(ChatContext);

    const history = useHistory();

    return (
        <div
            style={{
                zIndex: 9999,
                right: "10px",
                bottom: "20px",
                width: "280px",
                display: "flex",
                position: "fixed",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <IconButton
                size="medium"
                onClick={() => {
                    chatDispatch({ type: "SET_INITIAL_VIDEO_CALL" });
                    pauseAudio(document.getElementById("phone-call-audio"));
                }}
            >
                <Avatar
                    style={{
                        width: "25px",
                        height: "25px",
                        color: "rgb(255,255,255)",
                        backgroundColor: "rgb(255,99,71)",
                    }}
                >
                    <Close />
                </Avatar>
            </IconButton>
            <div
                className="call"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    history.push("/video-call");
                    pauseAudio(document.getElementById("phone-call-audio"));
                }}
            >
                <div className="icon">
                    <AvatarIcon
                        size="55px"
                        text={videoCall.partner.name}
                        imageUrl={videoCall.partner.avatar_image}
                    />
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>{videoCall.partner.name} is calling ...</div>
        </div>
    );
};

export default VideoCallNotifications;
