import {
  Badge,
  Avatar,
  Button,
  Dialog,
  Switch,
  CardMedia,
  TextField,
  CardHeader,
  IconButton,
  Typography,
  CardContent,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { CameraAlt } from "@material-ui/icons";
import React, { useRef, useState, Fragment } from "react";

import { useChatRoom } from "../../hooks";
import { AvatarIcon, LoadingIcon } from "../common";

const UpdateChatRoom = ({ isOpen, chatRoom, setIsOpen }) => {
  const inputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [isPublic, setIsPublic] = useState(chatRoom?.is_public);
  const [chatRoomName, setChatRoomName] = useState(chatRoom?.name);
  const [imagePreview, setImagePreview] = useState(chatRoom?.avatar_image);

  const { isLoading, handleUpdateChatRoom } = useChatRoom();

  const handleChangeImage = (e) => {
    setImageUpload(e.target.files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => setImagePreview(reader.result);
  };

  return (
    <Fragment>
      <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
        <CardHeader
          action={
            <IconButton onClick={() => setIsOpen(false)}>
              <Close />
            </IconButton>
          }
          subheader={
            <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
              Update group
            </Typography>
          }
        />
        <CardMedia
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            justifyContent: "center",
          }}
        >
          <Badge
            overlap="rectangular"
            badgeContent={
              <IconButton
                style={{ top: "160px", right: "25px" }}
                onClick={() => inputRef.current.click()}
              >
                <Avatar>
                  <CameraAlt style={{ color: "black" }} />
                </Avatar>
              </IconButton>
            }
          >
            <AvatarIcon
              size="200px"
              fontSize="150px"
              imageUrl={imagePreview}
              text={chatRoomName || "?"}
            />
            <input
              type="file"
              ref={inputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChangeImage}
            />
          </Badge>
        </CardMedia>
        <div style={{ textAlign: "center" }}>
          <Switch
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </div>
        <Typography
          style={{ fontWeight: 800, fontSize: "20px", textAlign: "center" }}
        >
          {chatRoomName}
        </Typography>
        <CardContent style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            value={chatRoomName}
            label="Chat room name"
            placeholder="Enter chat room name"
            style={{ flex: 4, marginRight: "16px" }}
            onChange={(e) => setChatRoomName(e.target.value)}
          />
          <Button
            color="primary"
            variant="contained"
            disabled={isLoading}
            style={{ flex: 1, borderRadius: "5px" }}
            onClick={() => {
              handleUpdateChatRoom({
                isPublic,
                imageUpload,
                chatRoomName,
                chatRoomId: chatRoom._id,
                currentImage: chatRoom.avatar_image,
              });

              setIsOpen(false);
            }}
          >
            <LoadingIcon text={"Update"} isLoading={isLoading} />
          </Button>
        </CardContent>
      </Dialog>
    </Fragment>
  );
};

export default UpdateChatRoom;
