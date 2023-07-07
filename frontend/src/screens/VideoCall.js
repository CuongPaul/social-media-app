import Peer from "simple-peer";
import React, { useRef, useState, Fragment, useEffect, useContext } from "react";

import { UIContext, ChatContext, UserContext } from "../App";

const VideoCall = () => {
    const {
        chatDispatch,
        chatState: { videoCall },
    } = useContext(ChatContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { socketIO } = useContext(UIContext);

    const myVideo = useRef();
    const partnerVideo = useRef();
    const [stream, setStream] = useState();
    const [isPartnerAnswer, setIsPartnerAnswer] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        });
    }, []);

    useEffect(() => {
        if (stream && videoCall.isCaller) {
            const peer = new Peer({ stream, trickle: false, initiator: true });

            peer.on("signal", (data) => {
                const senderData = {
                    signal_data: data,
                    _id: currentUser._id,
                    name: currentUser.name,
                    avatar_image: currentUser.avatar_image,
                };

                socketIO.current.emit("make-phone-call", {
                    sender: senderData,
                    receiver_id: videoCall.partner._id,
                });

                chatDispatch({ payload: senderData, type: "SET_MY_VIDEO_CALL" });
            });
            peer.on("stream", (stream) => (partnerVideo.current.srcObject = stream));

            socketIO.current.on("receiver-answer-phone-call", (receiver_signal_data) => {
                setIsPartnerAnswer(true);
                peer.signal(receiver_signal_data);

                chatDispatch({
                    type: "SET_PARTNER_VIDEO_CALL",
                    payload: {
                        _id: videoCall.partner._id,
                        name: videoCall.partner.name,
                        signal_data: receiver_signal_data,
                        avatar_image: videoCall.partner.avatar_image,
                    },
                });
            });
        }
    }, [stream]);

    useEffect(() => {
        if (stream && videoCall.isCaller === false) {
            setIsPartnerAnswer(true);
            const peer = new Peer({ stream, trickle: false, initiator: true });

            peer.on("signal", (data) => {
                socketIO.current.emit("answer-phone-call", {
                    receiver_signal_data: data,
                    called_by_user: videoCall.partner._id,
                });

                chatDispatch({
                    type: "SET_MY_VIDEO_CALL",
                    payload: {
                        signal_data: data,
                        _id: currentUser._id,
                        name: currentUser.name,
                        avatar_image: currentUser.avatar_image,
                    },
                });
            });
            peer.on("stream", (stream) => (partnerVideo.current.srcObject = stream));

            peer.signal(videoCall.partner.signal_data);
        }
    }, [stream]);

    return (
        <Fragment>
            <video muted autoPlay playsInline ref={myVideo} />
            {isPartnerAnswer && <video autoPlay playsInline ref={partnerVideo} />}
        </Fragment>
    );
};

export default VideoCall;
