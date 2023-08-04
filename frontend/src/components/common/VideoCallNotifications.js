import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import AvatarIcon from "./AvatarIcon";
import { ChatContext } from "../../App";

const VideoCallNotifications = () => {
    const {
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
            <div
                className="call"
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/video-call")}
            >
                <div className="icon">
                    <AvatarIcon
                        size="50px"
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
