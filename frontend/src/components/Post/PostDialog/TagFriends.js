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
    CircularProgress,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUserTag } from "@fortawesome/free-solid-svg-icons";

import AvatarIcon from "../../UI/AvatarIcon";
import { useSearchFriends } from "../../../hooks";

const TagFriends = ({ tagFriends, setTagFriends }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { friends, isLoading, handleSearchFriends } = useSearchFriends();

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
                style={{ marginTop: "50px" }}
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
                            label="Name"
                            variant="outlined"
                            value={searchValue}
                            placeholder="Enter name"
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ flex: 4, width: "100%", marginRight: "16px" }}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSearchFriends(searchValue)
                            }
                            InputProps={{
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={() => setSearchValue("")}
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
                            onClick={() => handleSearchFriends(searchValue)}
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                        >
                            {isLoading ? (
                                <CircularProgress
                                    size={25}
                                    variant="indeterminate"
                                    style={{ color: "#fff" }}
                                />
                            ) : (
                                "Search"
                            )}
                        </Button>
                    </div>
                    <List>
                        {friends.map((friend) => (
                            <ListItem key={friend._id}>
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
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setTagFriends([...tagFriends, friend]);
                                            } else {
                                                setTagFriends(
                                                    tagFriends.filter(
                                                        (item) => item._id !== friend._id
                                                    )
                                                );
                                            }
                                        }}
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
