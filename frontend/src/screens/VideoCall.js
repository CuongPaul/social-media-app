import Peer from "simple-peer";
import { Phone } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import React, { useRef, useState, useEffect, useContext } from "react";

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
    const history = useHistory();
    const partnerVideo = useRef();
    const connectionRef = useRef();
    const [stream, setStream] = useState();
    const [isPartnerAnswer, setIsPartnerAnswer] = useState(false);

    useEffect(() => {
        if (videoCall.me || videoCall.partner) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
                setStream(stream);
                myVideo.current.srcObject = stream;
            });
        } else {
            history.push("/messenger");
        }
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

            connectionRef.current = peer;
        }
    }, [stream]);

    useEffect(() => {
        if (stream && videoCall.isCaller === false) {
            setIsPartnerAnswer(true);
            const peer = new Peer({ stream, trickle: false, initiator: false });

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

            connectionRef.current = peer;
        }
    }, [stream]);

    useEffect(() => {
        if (stream) {
            socketIO.current.on("end-phone-call-to-partner", () => {
                stream.getTracks().forEach((track) => track.stop());

                history.push("/messenger");
            });

            return () => {
                stream.getTracks().forEach((track) => track.stop());

                if (videoCall.partner.signal_data) {
                    socketIO.current.emit("end-phone-call-when-exit-page", {
                        receiver_id: videoCall.partner._id,
                    });
                }
            };
        }
    }, [stream]);

    const handleClickEndCall = () => {
        connectionRef.current.destroy();
        chatDispatch({ type: "SET_INITIAL_VIDEO_CALL" });
        stream.getTracks().forEach((track) => track.stop());

        if (videoCall.partner.signal_data) {
            socketIO.current.emit("end-phone-call", { receiver_id: videoCall.partner._id });
        }

        history.push("/messenger");
    };

    return (
        <div
            style={{
                display: "flex",
                marginTop: "64px",
                alignItems: "center",
                flexDirection: "column",
                height: `calc(100vh - 64px)`,
                justifyContent: "space-evenly",
            }}
        >
            {(videoCall.me || videoCall.partner) && (
                <div style={{ width: "100vw", display: "flex", justifyContent: "space-evenly" }}>
                    <video
                        muted
                        autoPlay
                        playsInline
                        ref={myVideo}
                        style={{ borderRadius: "10px" }}
                    />
                    {isPartnerAnswer && (
                        <video
                            autoPlay
                            playsInline
                            ref={partnerVideo}
                            style={{ borderRadius: "10px" }}
                        />
                    )}
                </div>
            )}
            {stream && connectionRef.current && (
                <div style={{ borderRadius: "50%", backgroundColor: "rgb(255,0,0)" }}>
                    <IconButton color="default" onClick={handleClickEndCall}>
                        <Phone />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default VideoCall;
