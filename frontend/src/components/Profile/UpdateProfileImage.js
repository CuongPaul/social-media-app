import {
    Badge,
    Button,
    Dialog,
    Avatar,
    IconButton,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { CameraAlt as CameraIcon } from "@material-ui/icons";
import React, { useContext, useRef, useState } from "react";

import { UserContext } from "../../App";
import AvartarText from "../UI/AvartarText";
import DialogLoading from "../UI/DialogLoading";
import useUpdateProfilePic from "../../hooks/useUpdateProfilePic";

const UpdateProfileImage = ({ user }) => {
    const { userState } = useContext(UserContext);

    const history = useHistory();
    const inputFileRef = useRef(null);
    const [menu, setMenu] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { updateProfilePic, loading } = useUpdateProfilePic({
        avatar_image: profilePic,
        history,
    });

    const handleImageChange = (e) => {
        setProfilePic(e.target.files[0]);
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
        updateProfilePic();
        handleCancel();
    };

    const handleCancel = () => {
        setProfilePic(null);
        setPreviewImage(null);
        setMenu(false);
    };

    return (
        <div>
            <Badge
                overlap="rectangular"
                badgeContent={
                    userState.currentUser.id === user.id && (
                        <IconButton style={{ bottom: -140, left: -20 }} onClick={handleImageClick}>
                            <Avatar>
                                <CameraIcon style={{ color: "black" }} />
                            </Avatar>
                        </IconButton>
                    )
                }
                style={{
                    position: "absolute",
                    bottom: -30,
                    width: "170px",
                    height: "170px",
                    zIndex: 2,
                    left: "40%",
                }}
            >
                {user.avatar_image ? (
                    <Avatar
                        style={{
                            width: "170px",
                            height: "170px",
                        }}
                    >
                        <img src={user.avatar_image} width="100%" height="100%" alt={user.name} />
                    </Avatar>
                ) : (
                    <AvartarText
                        text={user?.name}
                        backgroundColor={user?.active ? "seagreen" : "tomato"}
                        fontSize="40px"
                        size="170px"
                    />
                )}
            </Badge>
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
                <DialogTitle>Profile Picture</DialogTitle>
                <DialogContent>
                    {previewImage && <img src={previewImage} width="100%" height="400px" alt="" />}
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

            {loading && <DialogLoading loading={loading} text="Uploading Profile Pic..." />}
        </div>
    );
};

export default UpdateProfileImage;
