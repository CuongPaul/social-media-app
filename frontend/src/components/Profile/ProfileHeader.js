import {
    Grid,
    Badge,
    Paper,
    Avatar,
    Button,
    Dialog,
    CardHeader,
    IconButton,
    Typography,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { CameraAlt } from "@material-ui/icons";
import React, { useRef, useState, Fragment, useContext } from "react";

import { UserContext } from "../../App";
import { AvatarIcon, LoadingIcon } from "../common";
import { useUser, useFriendRequest } from "../../hooks";

const ButtonAction = ({ text, onClick, backgroundColor }) => (
    <Button
        onClick={onClick}
        variant="contained"
        style={{
            fontSize: "10px",
            minWidth: "80px",
            color: "rgb(255,255,255)",
            margin: "20px 0px 10px 20px",
            backgroundColor: backgroundColor,
        }}
    >
        {text}
    </Button>
);

const ProfileHeader = ({ user, conScreen }) => {
    const {
        userState: { currentUser, sendedFriendRequests },
    } = useContext(UserContext);

    const params = useParams();
    const fileRef = useRef(null);
    const [typeUpload, setTyppeUpload] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isOpenPreviewImage, setIsOpenPreviewImage] = useState(false);

    const {
        isLoading,
        handleUnfriend,
        handleBlockUser,
        handleUnblockUser,
        handleUpdateCoverImage,
        handleUpdateAvatarImage,
    } = useUser();
    const { handleSendFriendRequest, handleCancelFriendRequest } = useFriendRequest();

    const handleChangeImage = (e) => {
        setImageUpload(e.target.files[0]);

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setIsOpenPreviewImage(true);
            setImagePreview(reader.result);
        };
    };

    const handleClickUpload = () => {
        if (typeUpload === "avatar-image") {
            handleUpdateAvatarImage(imageUpload);
        } else {
            handleUpdateCoverImage(imageUpload);
        }

        handleClickCancel();
    };

    const handleClickCancel = () => {
        setImagePreview("");
        setImageUpload(null);
        setIsOpenPreviewImage(false);
    };

    return (
        <Fragment>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item md={conScreen ? 12 : 6} xs={12} sm={12}>
                    <Paper
                        style={{
                            height: "40vh",
                            borderRadius: "10px",
                            position: "relative",
                            backgroundPosition: "center",
                            backgroundColor: !user?.cover_image && "rgba(0,0,0,0.5)",
                            backgroundImage: user?.cover_image && `url("${user?.cover_image}")`,
                        }}
                    >
                        {currentUser?._id === params.userId && (
                            <IconButton
                                onClick={() => {
                                    fileRef.current.click();
                                    setTyppeUpload("cover-image");
                                }}
                                style={{ right: "20px", bottom: "20px", position: "absolute" }}
                            >
                                <Avatar>
                                    <CameraAlt style={{ color: "black" }} />
                                </Avatar>
                            </IconButton>
                        )}
                        <Badge
                            overlap="rectangular"
                            style={{
                                left: "43px",
                                width: "170px",
                                bottom: "-60px",
                                margin: "0px auto",
                                position: "absolute",
                            }}
                            badgeContent={
                                currentUser?._id === params.userId && (
                                    <IconButton
                                        onClick={() => {
                                            fileRef.current.click();
                                            setTyppeUpload("avatar-image");
                                        }}
                                        style={{ left: "-20px", bottom: "-135px" }}
                                    >
                                        <Avatar>
                                            <CameraAlt style={{ color: "black" }} />
                                        </Avatar>
                                    </IconButton>
                                )
                            }
                        >
                            <AvatarIcon
                                size="170px"
                                fontSize="50px"
                                text={user?.name}
                                imageUrl={user?.avatar_image}
                            />
                        </Badge>
                        <input
                            type="file"
                            ref={fileRef}
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleChangeImage}
                        />
                        <Dialog open={isOpenPreviewImage} onClose={handleClickCancel}>
                            <CardHeader
                                action={
                                    <IconButton color="primary" onClick={handleClickCancel}>
                                        <Close />
                                    </IconButton>
                                }
                                subheader={
                                    <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
                                        Upload {typeUpload === "avatar-image" ? "avatar" : "cover"}{" "}
                                        image
                                    </Typography>
                                }
                            />
                            <DialogContent>
                                <img
                                    alt={""}
                                    src={imagePreview}
                                    style={{ width: "100%", borderRadius: "10px" }}
                                />
                            </DialogContent>
                            <DialogActions
                                style={{
                                    display: "flex",
                                    marginBottom: "10px",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    color="primary"
                                    variant="contained"
                                    disabled={isLoading}
                                    onClick={handleClickUpload}
                                >
                                    <LoadingIcon text={"Upload"} isLoading={isLoading} />
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleClickCancel}
                                    style={{
                                        color: "rgb(255,255,255)",
                                        backgroundColor: "rgb(255,99,72)",
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Paper>
                </Grid>
            </Grid>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "55px" }}
            >
                {user?._id !== currentUser?._id && (
                    <Grid
                        item
                        md={conScreen ? 12 : 6}
                        style={{ display: "flex", justifyContent: "end" }}
                    >
                        {currentUser?.friends.find((item) => item._id === user?._id) ? (
                            <ButtonAction
                                text={"Unfriend"}
                                backgroundColor={"rgb(108,117,125)"}
                                onClick={() => handleUnfriend(user?._id)}
                            />
                        ) : sendedFriendRequests?.find(
                              (item) => item.receiver._id === user?._id
                          ) ? (
                            <ButtonAction
                                text={"Cancel"}
                                backgroundColor={"rgb(255,193,7)"}
                                onClick={() =>
                                    handleCancelFriendRequest(
                                        sendedFriendRequests?.find(
                                            (item) => item.receiver._id === user?._id
                                        )._id
                                    )
                                }
                            />
                        ) : (
                            <ButtonAction
                                text={"Add"}
                                backgroundColor={"rgb(0,123,255)"}
                                onClick={() => handleSendFriendRequest(user?._id)}
                            />
                        )}
                        {currentUser?.block_users.includes(user?._id) ? (
                            <ButtonAction
                                text={"Unblock"}
                                backgroundColor={"rgb(23,162,184)"}
                                onClick={() => handleUnblockUser(user?._id)}
                            />
                        ) : (
                            <ButtonAction
                                text={"Block"}
                                backgroundColor={"rgb(220,53,69)"}
                                onClick={() => handleBlockUser(user?._id)}
                            />
                        )}
                    </Grid>
                )}
            </Grid>
            <Grid container alignItems="center" justifyContent="center">
                <Typography style={{ fontSize: "30px", fontWeight: "800" }}>
                    {user?.name}
                </Typography>
            </Grid>
        </Fragment>
    );
};

export default ProfileHeader;
