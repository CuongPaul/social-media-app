import React, { useState } from "react";
import { Close, ZoomIn } from "@material-ui/icons";
import { Box, Modal, Avatar, CardMedia, IconButton } from "@material-ui/core";

const FilePreview = ({ filePreview, size = "100%", zoomOutVideo, handleRemoveFile }) => {
    const fileType = filePreview.slice(0, 10);

    let component = "video";
    if (fileType === "data:image") component = "img";
    if (fileType === "blob:http:") component = "blob";

    if (filePreview.includes("https://firebasestorage.googleapis.com")) {
        const beforeString = filePreview.substring(0, filePreview.indexOf("?alt=media&token="));

        const fileTypeUpload = beforeString.substring(beforeString.lastIndexOf(".") + 1);

        if (fileTypeUpload !== "mp4") component = "img";
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: "relative", margin: "20px 0px" }}>
            {component === "blob" ? (
                <img
                    alt={""}
                    src={filePreview}
                    style={{ width: size, height: size, borderRadius: "10px" }}
                />
            ) : zoomOutVideo && component === "video" ? (
                <div
                    style={{
                        width: size,
                        height: size,
                        display: "flex",
                        cursor: "pointer",
                        alignItems: "center",
                        borderRadius: "10px",
                        justifyContent: "center",
                        backgroundColor: "rgb(238,178,59,0.8)",
                    }}
                >
                    <ZoomIn fontSize="large" onClick={() => setIsOpen(true)} />
                </div>
            ) : (
                <CardMedia
                    controls
                    image={filePreview}
                    component={component}
                    style={{ width: size, height: size, borderRadius: "10px" }}
                />
            )}
            <div
                style={{
                    top: "-20px",
                    right: "-20px",
                    position: "absolute",
                }}
            >
                <IconButton size="medium" onClick={handleRemoveFile}>
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
            </div>
            {isOpen && (
                <Modal open={isOpen} style={{ display: "flex" }} onClose={() => setIsOpen(false)}>
                    <Box
                        style={{
                            width: "75vw",
                            height: "75vh",
                            margin: "auto",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "20px",
                            justifyContent: "center",
                            backgroundColor: "rgba(255,255,255)",
                        }}
                    >
                        <CardMedia
                            controls
                            image={filePreview}
                            component={component}
                            style={{
                                width: "auto",
                                height: "auto",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default FilePreview;
