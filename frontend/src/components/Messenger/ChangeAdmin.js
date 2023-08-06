import {
    List,
    Button,
    Dialog,
    Checkbox,
    ListItem,
    TextField,
    CardHeader,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    DialogContent,
    InputAdornment,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useChatRoom } from "../../hooks";
import { UIContext, ChatContext, UserContext } from "../../App";
import { AvatarIcon, BadgeStyled, LoadingIcon } from "../common";

const ChangeAdmin = ({ isOpen, setIsOpen }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);
    const {
        userState: { currentUser, friendsOnline },
    } = useContext(UserContext);

    const [members, setMembers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [memberSelected, setMemberSelected] = useState(null);

    const { isLoading, handleChangeAdmin } = useChatRoom();

    const handleSearchMembers = (searchValue) => {
        const regex = new RegExp(searchValue, "i");
        setMembers(chatRoomSelected?.members.filter((item) => regex.test(item.name)));
    };

    useEffect(() => {
        setSearchValue("");
        setMemberSelected(null);
        setMembers(chatRoomSelected?.members);
    }, [chatRoomSelected]);

    return (
        <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
            <CardHeader
                action={
                    <IconButton onClick={() => setIsOpen(false)}>
                        <Close />
                    </IconButton>
                }
                subheader={
                    <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
                        Members group {chatRoomSelected?.name}
                    </Typography>
                }
            />
            <DialogContent>
                <div style={{ display: "flex", marginBottom: "32px" }}>
                    <TextField
                        autoFocus
                        label="Name"
                        variant="outlined"
                        value={searchValue}
                        placeholder="Enter name"
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            if (!e.target.value) {
                                setMembers(chatRoomSelected?.members);
                            }
                        }}
                        style={{ flex: 4, width: "100%", marginRight: "16px" }}
                        InputProps={{
                            endAdornment: searchValue && (
                                <InputAdornment position="end">
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        onClick={() => {
                                            setSearchValue("");
                                            setMembers(chatRoomSelected?.members);
                                        }}
                                        style={{ marginRight: "10px", cursor: "pointer" }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        onKeyPress={(e) => e.key === "Enter" && handleSearchMembers(searchValue)}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleSearchMembers(searchValue)}
                        style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                    >
                        Search
                    </Button>
                </div>
                <List>
                    {members?.map((member) => (
                        <div
                            key={member._id}
                            style={{
                                display: "flex",
                                cursor: "pointer",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                backgroundColor: darkMode ? "rgb(58,59,60)" : "rgb(240,242,245)",
                            }}
                        >
                            <ListItem
                                onClick={() =>
                                    member._id !== currentUser._id && setMemberSelected(member)
                                }
                            >
                                <ListItemIcon>
                                    <BadgeStyled
                                        isActive={friendsOnline.some(
                                            (item) => item._id === member._id
                                        )}
                                    >
                                        <AvatarIcon
                                            text={member.name}
                                            imageUrl={member.avatar_image}
                                        />
                                    </BadgeStyled>
                                </ListItemIcon>
                                <ListItemText style={{ marginLeft: "16px" }}>
                                    <Typography
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "17px",
                                            color: darkMode ? "rgb(255,255,255)" : "rgb(33,33,33)",
                                        }}
                                    >
                                        {member.name}
                                    </Typography>
                                </ListItemText>
                                <ListItemIcon>
                                    {chatRoomSelected?.admin === member._id ? (
                                        "Admin"
                                    ) : (
                                        <Checkbox checked={member._id === memberSelected?._id} />
                                    )}
                                </ListItemIcon>
                            </ListItem>
                        </div>
                    ))}
                </List>
                <Button
                    color="primary"
                    variant="contained"
                    disabled={!Boolean(memberSelected)}
                    onClick={() => {
                        handleChangeAdmin({
                            newAdmin: memberSelected._id,
                            chatRoomId: chatRoomSelected?._id,
                        });

                        setIsOpen(false);
                    }}
                    style={{ width: "100%", borderRadius: "5px", marginBottom: "10px" }}
                >
                    <LoadingIcon text={"Confirm"} isLoading={isLoading} />
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeAdmin;
