import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { ChatContext } from "../../App";

const VideoCallNotifications = () => {
    const {
        chatState: { videoCall },
    } = useContext(ChatContext);

    const history = useHistory();

    return (
        <div
            onClick={() => history.push("/video-call")}
            style={{ zIndex: 9999, right: "50px", bottom: "25px", position: "fixed" }}
        >
            {videoCall.sender.name}
        </div>
    );
};

export default VideoCallNotifications;
