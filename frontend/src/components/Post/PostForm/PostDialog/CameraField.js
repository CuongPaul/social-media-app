import {
    Grid,
    Avatar,
    Dialog,
    Tooltip,
    Container,
    CardHeader,
    IconButton,
    Typography,
    DialogContent,
} from "@material-ui/core";
import React, { useRef, Fragment, useState } from "react";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, Close, Camera, ArrowBack } from "@material-ui/icons";

const CameraField = ({
    setBlob,
    setPostImage,
    setPreviewImage,
    isImageCaptured,
    setIsImageCaptured,
}) => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    const cameraInitialization = async () => {
        try {
            const constraints = { video: true };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            videoRef.current.srcObject = stream;
        } catch (err) {
            console.error(err);
        }
    };

    const cameraShutdown = () => {
        if (videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getVideoTracks();

            for (const track of tracks) {
                track.stop();
            }
        }
    };

    const handleOpenCamera = () => {
        cameraInitialization();
        setIsOpen(true);
    };

    const handleCloseCamera = () => {
        cameraShutdown();
        setIsOpen(false);
    };

    const handleRemoveImage = () => {
        cameraInitialization();
        setIsImageCaptured(false);
    };

    const handleAddImage = () => {
        canvasRef.current.toBlob((blob) => {
            setBlob(blob);
            setPostImage(null);
            setPreviewImage("");
        });

        cameraShutdown();
        setIsOpen(false);
    };

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.getBoundingClientRect().width;
        canvas.height = video.getBoundingClientRect().height;

        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

        setIsImageCaptured(true);
        cameraShutdown();
    };

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Upload images from camera">
                <IconButton onClick={handleOpenCamera}>
                    <FontAwesomeIcon icon={faCamera} color="rgb(24,119,242)" />
                </IconButton>
            </Tooltip>
            <Dialog
                fullWidth
                scroll="body"
                maxWidth="sm"
                open={isOpen}
                style={{ width: "100%" }}
                onClose={handleCloseCamera}
            >
                <CardHeader
                    avatar={
                        <IconButton onClick={handleCloseCamera}>
                            <ArrowBack />
                        </IconButton>
                    }
                    subheader={
                        <Typography style={{ fontSize: "20px", fontWeight: "800" }}>
                            Upload images from camera
                        </Typography>
                    }
                />
                <DialogContent>
                    <Container>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item md={12} xs={12} sm={12}>
                                <video
                                    autoPlay
                                    playsInline
                                    ref={videoRef}
                                    style={{
                                        width: "100%",
                                        display: isImageCaptured ? "none" : "block",
                                    }}
                                />
                                <canvas
                                    height="240"
                                    ref={canvasRef}
                                    style={{ display: isImageCaptured ? "block" : "none" }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        marginTop: "16px",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        marginBottom: "16px",
                                        justifyContent: "center",
                                    }}
                                >
                                    {isImageCaptured ? (
                                        <div>
                                            <IconButton onClick={handleRemoveImage} size="medium">
                                                <Avatar
                                                    style={{ background: "tomato", color: "white" }}
                                                >
                                                    <Close />
                                                </Avatar>
                                            </IconButton>
                                            <IconButton size="medium" onClick={handleAddImage}>
                                                <Avatar
                                                    style={{
                                                        color: "white",
                                                        background: "seagreen",
                                                    }}
                                                >
                                                    <Check />
                                                </Avatar>
                                            </IconButton>
                                        </div>
                                    ) : (
                                        <IconButton
                                            size="medium"
                                            color="primary"
                                            onClick={handleCapture}
                                        >
                                            <Avatar style={{ color: "white", background: "teal" }}>
                                                <Camera />
                                            </Avatar>
                                        </IconButton>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default CameraField;
