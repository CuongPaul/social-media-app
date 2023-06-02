import {
    Avatar,
    Dialog,
    Button,
    IconButton,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import React, { useContext, useState, useRef } from "react";
import { CameraAlt as CameraIcon } from "@material-ui/icons";

import DialogLoading from "../UI/DialogLoading";
import useUpdateProfilePic from "../../hooks/useUpdateProfilePic";
import { UserContext } from "../../App";

const UpdateCoverImage = () => {
    const { userState } = useContext(UserContext);

    const params = useParams();

    const history = useHistory();
    const inputFileRef = useRef(null);
    const [menu, setMenu] = useState(false);
    const [coverPic, setCoverPic] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { updateCoverPic, loading } = useUpdateProfilePic({
        cover_pic: coverPic,
        history,
    });

    const handleImageChange = (e) => {
        setCoverPic(e.target.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setPreviewImage(reader.result);
            setMenu(true);
        };
    };

    const handleImageClick = () => {
        inputFileRef.current.click();
    };

    const handleUpload = () => {
        updateCoverPic();
        handleCancel();
    };

    const handleCancel = () => {
        setCoverPic(null);
        setPreviewImage(null);
        setMenu(false);
    };

    return (
        <div>
            {userState.currentUser._id === params.userId && (
                <IconButton
                    onClick={handleImageClick}
                    style={{ position: "absolute", bottom: 30, left: 20, zIndex: 2 }}
                >
                    <Avatar>
                        <CameraIcon style={{ color: "blue" }} />
                    </Avatar>
                </IconButton>
            )}

            {loading && <DialogLoading loading={loading} text="Uploading Cover  Pic..." />}

            <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                ref={inputFileRef}
                onChange={handleImageChange}
            />

            <Dialog
                disableEscapeKeyDown
                fullWidth
                scroll="body"
                maxWidth="sm"
                open={menu}
                onClose={() => setMenu(false)}
                style={{ width: "100%" }}
            >
                <DialogTitle>Cover Picture</DialogTitle>
                <DialogContent>
                    {previewImage && (
                        <img src={previewImage} width="100%" height="400px" alt="preview" />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleUpload} color="primary">
                        Upload
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCancel}
                        style={{ backgroundColor: "tomato", color: "#fff" }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UpdateCoverImage;
