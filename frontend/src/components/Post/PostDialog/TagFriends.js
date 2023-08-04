import {
    Chip,
    List,
    Button,
    Dialog,
    Tooltip,
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
import { ArrowBack } from "@material-ui/icons";
import React, { useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUserTag } from "@fortawesome/free-solid-svg-icons";

import { useSearch } from "../../../hooks";
import { AvatarIcon, LoadingIcon } from "../../common";

const TagFriends = ({ tagFriends, setTagFriends }) => {
    const [page, setPage] = useState(1);
    const [friends, setFriends] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { isLoading, handleSearchFriends } = useSearch();

    const handleScroll = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isBottom = scrollHeight - scrollTop === clientHeight;

        if (isBottom) {
            setPage(page + 1);
            handleSearchFriends({ setFriends, page: page + 1, name: searchValue });
        }
    };

    const handleClickFriend = (friend) => {
        const isSelected = tagFriends.findIndex((item) => item._id === friend._id);
        if (isSelected === -1) {
            setTagFriends([...tagFriends, friend]);
        } else {
            setTagFriends(tagFriends.filter((item) => item._id !== friend._id));
        }
    };

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Tag your friends">
                <IconButton onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faUserTag} color="rgb(24,119,242)" />
                </IconButton>
            </Tooltip>
            <Dialog
                fullWidth
                open={isOpen}
                onScroll={handleScroll}
                onClose={() => setIsOpen(false)}
            >
                <CardHeader
                    avatar={
                        <IconButton onClick={() => setIsOpen(false)}>
                            <ArrowBack />
                        </IconButton>
                    }
                    subheader={
                        <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
                            Tag your friends
                        </Typography>
                    }
                />
                <DialogContent>
                    <div style={{ marginBottom: "20px" }}>
                        {tagFriends.map((friend) => (
                            <Chip
                                key={friend._id}
                                label={friend.name}
                                style={{ marginRight: "10px" }}
                                onDelete={() =>
                                    setTagFriends(
                                        tagFriends.filter((item) => item._id !== friend._id)
                                    )
                                }
                            />
                        ))}
                    </div>
                    <div style={{ display: "flex", marginBottom: "32px" }}>
                        <TextField
                            autoFocus
                            label="Name"
                            variant="outlined"
                            value={searchValue}
                            placeholder="Enter name"
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ flex: 4, width: "100%", marginRight: "16px" }}
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleSearchFriends({ setFriends, name: searchValue })
                            }
                            InputProps={{
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={() => {
                                                setFriends([]);
                                                setSearchValue("");
                                            }}
                                            style={{ marginRight: "10px", cursor: "pointer" }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                            onClick={() => handleSearchFriends({ setFriends, name: searchValue })}
                        >
                            <LoadingIcon text={"Search"} isLoading={isLoading} />
                        </Button>
                    </div>
                    <List>
                        {friends.map((friend) => (
                            <ListItem
                                key={friend._id}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    backgroundColor: "rgb(244,245,246)",
                                }}
                                onClick={() => handleClickFriend(friend)}
                            >
                                <ListItemIcon>
                                    <AvatarIcon
                                        size="60px"
                                        text={friend.name}
                                        imageUrl={friend.avatar_image}
                                    />
                                </ListItemIcon>
                                <ListItemText style={{ marginLeft: "32px" }}>
                                    <Typography style={{ fontSize: "17px", fontWeight: "700" }}>
                                        {friend.name}
                                    </Typography>
                                </ListItemText>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={tagFriends.some((item) => item._id === friend._id)}
                                    />
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default TagFriends;
