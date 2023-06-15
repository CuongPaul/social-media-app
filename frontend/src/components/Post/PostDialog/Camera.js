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
import React, { useRef, useState, Fragment } from "react";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, Close, ArrowBack, Camera as CameraMaterial } from "@material-ui/icons";

const Camera = ({ setFilesUpload, setFilesPreview }) => {
    const videoRef = useRef();
    const canvasRef = useRef();

    const [isOpen, setIsOpen] = useState(false);
    const [isCaptured, setIsCaptured] = useState(false);

    const startCamera = async () => {
        try {
            const constraints = { video: true };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            videoRef.current.srcObject = stream;
        } catch (err) {
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getVideoTracks();

            for (const track of tracks) {
                track.stop();
            }
        }
    };

    const handleOpenCamera = () => {
        startCamera();
        setIsOpen(true);
    };

    const handleCloseCamera = () => {
        stopCamera();
        setIsOpen(false);
        setIsCaptured(false);
    };

    const handleClickCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.getBoundingClientRect().width;
        canvas.height = video.getBoundingClientRect().height;

        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

        stopCamera();
        setIsCaptured(true);
    };

    const handleAddCaptureImage = () => {
        canvasRef.current.toBlob((blob) => {
            setFilesUpload((preValue) => [...preValue, blob]);
            setFilesPreview((preValue) => [...preValue, URL.createObjectURL(blob)]);
        });

        stopCamera();
        setIsOpen(false);
        setIsCaptured(false);
    };

    const handleRemoveCaptureImage = () => {
        startCamera();
        setIsCaptured(false);
    };

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Upload images from camera">
                <IconButton onClick={handleOpenCamera}>
                    <FontAwesomeIcon icon={faCamera} color="rgb(24,119,242)" />
                </IconButton>
            </Tooltip>
            <Dialog fullWidth open={isOpen} style={{ width: "100%" }} onClose={handleCloseCamera}>
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
                                        display: isCaptured ? "none" : "block",
                                    }}
                                />
                                <canvas
                                    height="240"
                                    ref={canvasRef}
                                    style={{ display: isCaptured ? "block" : "none" }}
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
                                    {isCaptured ? (
                                        <div>
                                            <IconButton
                                                size="medium"
                                                onClick={handleRemoveCaptureImage}
                                            >
                                                <Avatar
                                                    style={{
                                                        color: "white",
                                                        backgroundColor: "tomato",
                                                    }}
                                                >
                                                    <Close />
                                                </Avatar>
                                            </IconButton>
                                            <IconButton
                                                size="medium"
                                                onClick={handleAddCaptureImage}
                                            >
                                                <Avatar
                                                    style={{
                                                        color: "white",
                                                        backgroundColor: "seagreen",
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
                                            onClick={handleClickCapture}
                                        >
                                            <Avatar
                                                style={{ color: "white", backgroundColor: "teal" }}
                                            >
                                                <CameraMaterial />
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

export default Camera;
