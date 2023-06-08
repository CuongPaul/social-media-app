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
import React, { useRef, useState, useContext } from "react";

import { UserContext } from "../../App";
import LoadingIcon from "../UI/Loading";
import AvatarIcon from "../UI/AvatarIcon";
import { useUser } from "../../hooks";

const ProfileHeader = ({ user, conScreen }) => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const params = useParams();
    const fileRef = useRef(null);
    const [typeUpload, setTyppeUpload] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isOpenPreviewImage, setIsOpenPreviewImage] = useState(false);

    const { isLoading, handleUpdateCoverImage, handleUpdateAvatarImage } = useUser();

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
        <div>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item md={conScreen ? 12 : 6} xs={12} sm={12}>
                    <Paper
                        style={{
                            height: "40vh",
                            marginTop: "70px",
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
                                style={{ left: "20px", bottom: "20px", position: "absolute" }}
                            >
                                <Avatar>
                                    <CameraAlt style={{ color: "black" }} />
                                </Avatar>
                            </IconButton>
                        )}
                        <Badge
                            overlap="rectangular"
                            style={{
                                left: "0px",
                                right: "0px",
                                width: "170px",
                                bottom: "-50px",
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
                                        style={{ left: "-10px", bottom: "-120px" }}
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
                                        Upload {typeUpload === "avatar-image" ? "cover" : "avatar"}{" "}
                                        image
                                    </Typography>
                                }
                            />
                            <DialogContent>
                                <img
                                    alt=""
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
                                    onClick={handleClickUpload}
                                >
                                    <LoadingIcon isLoading={isLoading} text={"Upload"} />
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleClickCancel}
                                    style={{ color: "#fff", backgroundColor: "rgb(255,99,72)" }}
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
                style={{ marginTop: "60px", marginBottom: "10px" }}
            >
                <Typography style={{ fontSize: "30px", fontWeight: "800" }}>
                    {user?.name}
                </Typography>
            </Grid>
        </div>
    );
};

export default ProfileHeader;
