import React, { useRef, Fragment } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileField = ({ handleImageChange }) => {
    const fileRef = useRef();

    // const handleImageChange = (e) => {
    //     const { files } = e.target;

    //     setPostImage(files);

    //     for (const file of files) {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => {
    //             setBlob(null);
    //             setIsImageCaptured(false);
    //             setPreviewImage((pre) => [...pre, reader.result]);
    //         };
    //     }
    // };

    const handleClickUpload = (e) => {
        e.preventDefault();
        fileRef.current.click();
    };

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Upload images from device">
                <IconButton onClick={handleClickUpload}>
                    <FontAwesomeIcon icon={faImage} color="rgb(73,189,99)" />
                </IconButton>
            </Tooltip>
            <input
                multiple
                type="file"
                ref={fileRef}
                capture="user"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />
        </Fragment>
    );
};

export default FileField;
