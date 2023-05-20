import {
    List,
    Badge,
    Button,
    Avatar,
    ListItem,
    Typography,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    Dialog,
    TextField,
    ListItemIcon,
    DialogContent,
    CircularProgress,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";

import AvatarIcon from "../UI/AvatarIcon";
import { UserContext, ChatContext, UIContext } from "../../App";
import callApi from "../../api";
import { useSearchUsers } from "../../hooks";

const Friends = () => {
    const { userState } = useContext(UserContext);
    const { chatDispatch } = useContext(ChatContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const [chatRooms, setChatRooms] = useState([]);
    const [isOpenCreateGroup, setIsOpenCreateGroup] = useState(false);

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/chat-room", method: "GET" });
            setChatRooms(data.rows);
        })();
    }, []);

    const handleClickChat = async (chat) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        chatDispatch({ type: "SET_SELECTED_FRIEND", payload: chat });
        const { data } = await callApi({ url: `/message/chat-room/${chat._id}`, method: "GET" });
        chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
    };

    const handleClickFriend = async (friend) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        chatDispatch({ type: "SET_SELECTED_FRIEND", payload: friend });
        const { message } = await callApi({
            url: `/chat-room/two-people`,
            method: "POST",
            data: { reciver: friend._id },
        });
    };

    const { users, isLoading, handleSearchUsers } = useSearchUsers();
    const [groupName, setGroupName] = useState("");
    const [groupMember, setGroupMember] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const handleCreateGroup = async () => {
        try {
            await callApi({
                method: "POST",
                url: "/chat-room",
                data: { name: groupName, members: groupMember },
            });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return (
        <List
            style={{ backgroundColor: uiState.darkMode && "rgb(36,37,38)" }}
            subheader={<ListSubheader component="div">Your Friends</ListSubheader>}
        >
            <Button onClick={() => setIsOpenCreateGroup(true)}>Create group</Button>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={isOpenCreateGroup}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpenCreateGroup(false)}
            >
                <DialogContent>
                    <TextField
                        variant="outlined"
                        value={groupName}
                        placeholder="Enter name"
                        style={{ width: "100%" }}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <Button
                        color="primary"
                        disabled={isLoading}
                        variant="contained"
                        onClick={() => handleCreateGroup()}
                        style={{ width: "100%", marginTop: "16px" }}
                    >
                        Create
                    </Button>
                    <hr></hr>
                    <TextField
                        variant="outlined"
                        value={searchValue}
                        placeholder="Enter name"
                        style={{ width: "100%" }}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearchUsers(searchValue)}
                    />
                    <Button
                        color="primary"
                        disabled={isLoading}
                        variant="contained"
                        onClick={() => handleSearchUsers(searchValue)}
                        style={{ width: "100%", marginTop: "16px" }}
                    >
                        Search
                    </Button>
                    <hr></hr>
                    {users.length ? (
                        <Typography variant="h6" style={{ marginTop: "20px" }}>
                            Search Results ({users.length})
                        </Typography>
                    ) : null}
                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                marginTop: "20px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <List>
                            {users &&
                                users.map((user) => (
                                    <div>
                                        <ListItem button key={user._id}>
                                            <ListItemIcon>
                                                <AvatarIcon
                                                    size="60px"
                                                    text={user.name}
                                                    imageUrl={user.avatar_image}
                                                />
                                            </ListItemIcon>
                                            <ListItemText style={{ marginLeft: "8px" }}>
                                                <Typography
                                                    style={{ fontSize: "17px", fontWeight: "700" }}
                                                >
                                                    {user.name}
                                                </Typography>
                                                <Typography>{user.email}</Typography>
                                            </ListItemText>
                                        </ListItem>

                                        {!groupMember.includes(user._id) ? (
                                            <Button
                                                onClick={() =>
                                                    setGroupMember((pre) => [...pre, user._id])
                                                }
                                                variant="contained"
                                                style={{
                                                    background: "rgb(1,133,243)",
                                                    color: "white",
                                                }}
                                            >
                                                Add to Group
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    const index = groupMember.findIndex(
                                                        (item) => user._id == item
                                                    );
                                                    if (index !== -1) {
                                                        const newGroupMember = [...groupMember];
                                                        newGroupMember.splice(index, 1);

                                                        setGroupMember(newGroupMember);
                                                    }
                                                }}
                                                variant="contained"
                                                style={{
                                                    background: "rgb(1,133,243)",
                                                    color: "white",
                                                }}
                                            >
                                                Remove from Group
                                            </Button>
                                        )}
                                    </div>
                                ))}
                        </List>
                    )}
                </DialogContent>
            </Dialog>
            {chatRooms && chatRooms.length ? (
                chatRooms.map((friend) => {
                    return (
                        <ListItem key={friend._id} button onClick={() => handleClickChat(friend)}>
                            <ListItemAvatar>
                                <Badge
                                    max={9}
                                    color="error"
                                    badgeContent={
                                        friend?.unseen_message ? friend?.unseen_message : null
                                    }
                                    overlap="rectangular"
                                >
                                    {friend.avatar_image ? (
                                        <AvatarIcon
                                            text={friend.name}
                                            imageUrl={friend.avatar_image}
                                        />
                                    ) : friend.members.length === 2 ? (
                                        <AvatarIcon
                                            text={
                                                friend.members.find(
                                                    (item) => item._id !== userState.currentUser._id
                                                ).name
                                            }
                                            imageUrl={
                                                friend.members.find(
                                                    (item) => item._id !== userState.currentUser._id
                                                ).avatar_image
                                            }
                                        />
                                    ) : (
                                        <AvatarIcon
                                            text={
                                                friend.members.find(
                                                    (item) => item._id !== userState.currentUser._id
                                                ).name
                                            }
                                        />
                                    )}
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    friend.members.length === 2
                                        ? friend.members.find(
                                              (item) => item._id !== userState.currentUser._id
                                          ).name
                                        : friend.name
                                }
                            />
                        </ListItem>
                    );
                })
            ) : (
                <Typography>No chats</Typography>
            )}
            <hr />
            {userState?.currentUser?.friends && userState?.currentUser?.friends?.length ? (
                userState.currentUser.friends.map((friend) => {
                    return (
                        <ListItem key={friend._id} button onClick={() => handleClickFriend(friend)}>
                            <ListItemAvatar>
                                <AvatarIcon text={friend.name} imageUrl={friend.avatar_image} />
                            </ListItemAvatar>
                            <ListItemText primary={friend.name} />
                        </ListItem>
                    );
                })
            ) : (
                <Typography>No friends</Typography>
            )}
        </List>
    );
};

export default Friends;
