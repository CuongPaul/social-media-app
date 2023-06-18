import {
    List,
    Button,
    Dialog,
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
import { Link } from "react-router-dom";
import { Close } from "@material-ui/icons";
import { Search } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UIContext } from "../../App";
import { useSearch } from "../../hooks";
import { AvatarIcon, LoadingIcon, ButtonGroupUserActions } from "../common";

const SearchUsers = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);

    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { isLoading, handleSearchUsers } = useSearch();

    return (
        <div style={{ marginLeft: "16px" }}>
            <Typography
                style={{
                    display: "flex",
                    cursor: "pointer",
                    minWidth: "200px",
                    paddingLeft: "20px",
                    alignItems: "center",
                    borderRadius: "20px",
                    color: "rgb(176,179,184)",
                    justifyContent: "space-between",
                    backgroundColor: darkMode ? "rgb(58,59,60)" : "rgb(240,242,245)",
                }}
                onClick={() => setIsOpen(true)}
            >
                Search
                <IconButton onClick={() => setIsOpen(true)}>
                    <Search />
                </IconButton>
            </Typography>
            <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
                <CardHeader
                    action={
                        <IconButton onClick={() => setIsOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                    subheader={
                        <Typography
                            style={{ fontWeight: 800, fontSize: "20px", marginLeft: "10px" }}
                        >
                            Search users
                        </Typography>
                    }
                />
                <DialogContent>
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                        <TextField
                            autoFocus
                            label="Name"
                            variant="outlined"
                            value={searchValue}
                            placeholder="Enter name"
                            style={{ flex: 4, width: "100%" }}
                            onChange={(e) => setSearchValue(e.target.value)}
                            InputProps={{
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={() => {
                                                setUsers([]);
                                                setSearchValue("");
                                            }}
                                            style={{ marginRight: "10px", cursor: "pointer" }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleSearchUsers({ setUsers, name: searchValue })
                            }
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                width: "100%",
                                marginLeft: "16px",
                                borderRadius: "10px",
                            }}
                            onClick={() => handleSearchUsers({ setUsers, name: searchValue })}
                        >
                            <LoadingIcon text={"Search"} isLoading={isLoading} />
                        </Button>
                    </div>
                    <List>
                        {users.map((user) => (
                            <div
                                key={user._id}
                                style={{
                                    display: "flex",
                                    cursor: "pointer",
                                    borderRadius: "5px",
                                    marginBottom: "10px",
                                    backgroundColor: darkMode
                                        ? "rgb(58,59,60)"
                                        : "rgb(240,242,245)",
                                }}
                            >
                                <ListItem
                                    component={Link}
                                    to={`/profile/${user._id}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ListItemIcon>
                                        <AvatarIcon text={user.name} imageUrl={user.avatar_image} />
                                    </ListItemIcon>
                                    <ListItemText style={{ marginLeft: "6px" }}>
                                        <Typography
                                            style={{
                                                fontWeight: 700,
                                                fontSize: "17px",
                                                color: darkMode
                                                    ? "rgb(255,255,255)"
                                                    : "rgb(33,33,33)",
                                            }}
                                        >
                                            {user.name}
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                                <ButtonGroupUserActions userId={user._id} />
                            </div>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SearchUsers;
