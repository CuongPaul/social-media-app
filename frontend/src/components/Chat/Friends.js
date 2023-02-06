import {
    List,
    Avatar,
    ListItem,
    Typography,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
} from "@material-ui/core";
import React, { useContext } from "react";

import AvartarText from "../UI/AvartarText";
import { getMessages } from "../../services/MessageService";
import { UserContext, ChatContext, UIContext } from "../../App";

const Friends = () => {
    const { userState } = useContext(UserContext);
    const { chatDispatch } = useContext(ChatContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const handleClickFriend = (friend) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        chatDispatch({ type: "SET_SELECTED_FRIEND", payload: friend });
        getMessages(friend.id)
            .then((res) => {
                if (res.data) {
                    chatDispatch({ type: "SET_MESSAGES", payload: res.data.data });
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <List
            style={{ backgroundColor: uiState.darkMode && "rgb(36,37,38)" }}
            subheader={<ListSubheader component="div">Your Friends</ListSubheader>}
        >
            {userState.currentUser.friends && userState.currentUser.friends.length ? (
                userState.currentUser.friends.map((friend) => {
                    return (
                        <ListItem key={friend.id} button onClick={() => handleClickFriend(friend)}>
                            <ListItemAvatar>
                                {friend.profile_pic ? (
                                    <Avatar alt={friend.name} src={friend.profile_pic} />
                                ) : (
                                    <AvartarText
                                        text={friend.name}
                                        bg={friend.active ? "seagreen" : "tomato"}
                                    />
                                )}
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
