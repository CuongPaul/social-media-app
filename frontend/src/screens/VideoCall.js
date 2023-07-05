import Peer from "simple-peer";
import React, { useRef, useState, Fragment, useEffect, useContext } from "react";

import { MessageInput } from "../components/Messenger";
import { UIContext, ChatContext, UserContext } from "../App";

const VideoCall = () => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { socketIO } = useContext(UIContext);
    const {
        chatState: { videoCall, chatRoomSelected },
    } = useContext(ChatContext);

    const myVideo = useRef();
    const partnerVideo = useRef();
    const connectionRef = useRef();
    const [signal, setSignal] = useState();
    const [stream, setStream] = useState();
    const [isPartnerAnswer, setIsPartnerAnswer] = useState(false);

    useEffect(() => {
        (async () => {
            const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

            setStream(media);
            myVideo.current.srcObject = media;

            const peer = new Peer({ stream: media, trickle: false, initiator: true });

            peer.on("signal", (data) => {
                const receiver = chatRoomSelected.members.find(
                    (member) => member._id !== currentUser._id
                );

                socketIO.current.emit("make-phone-call", {
                    sender_signal_data: data,
                    receiver_id: receiver._id,
                    sender: {
                        _id: currentUser._id,
                        name: currentUser.name,
                        avatar_image: currentUser.avatar_image,
                    },
                });
            });
            peer.on("stream", (stream) => (partnerVideo.current.srcObject = stream));

            socketIO.current.on("receiver-answer-phone-call", (receiver_signal_data) => {
                setIsPartnerAnswer(true);
                peer.signal(receiver_signal_data);
            });

            connectionRef.current = peer;
        })();

        if (videoCall) {
            (async () => {
                setIsPartnerAnswer(true);

                const peer = new Peer({ stream, trickle: false, initiator: true });

                peer.on("signal", (data) => {
                    socketIO.current.emit("answer-phone-call", {
                        receiver_signal_data: data,
                        called_by_user: videoCall.sender._id,
                    });
                });
                peer.on("stream", (stream) => (partnerVideo.current.srcObject = stream));

                peer.signal(videoCall.sender_signal_data);
                connectionRef.current = peer;
            })();
        }
    }, []);

    return (
        <Fragment>
            <div>
                <div>{myVideo && <video muted autoPlay playsInline ref={myVideo} />}</div>
                <div>{isPartnerAnswer && <video autoPlay playsInline ref={partnerVideo} />}</div>
            </div>
            {/* <Grid item md={3} style={{ margin: "20px", display: "flex", flexDirection: "column" }}>
                <Paper
                    ref={messageScroll}
                    onScroll={handleScrollMessage}
                    style={{
                        flex: 1,
                        display: "flex",
                        margin: "10px 0px",
                        borderRadius: "10px",
                        padding: "20px 30px ",
                        overflow: "hidden auto",
                        flexDirection: "column-reverse",
                        backgroundColor: darkMode && "rgb(36,37,38)",
                    }}
                >
                    {messages?.map((message) => (
                        <Message key={message._id} message={message} />
                    ))}
                </Paper>
                <MessageInput chatRoomId={chatRoomSelected._id} />
            </Grid> */}
        </Fragment>
    );
};

export default VideoCall;
