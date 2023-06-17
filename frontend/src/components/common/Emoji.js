import { Popover } from "@material-ui/core";
import EmojiPicker from "emoji-picker-react";
import React, { useState, Fragment } from "react";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Emoji = ({ setText }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <Fragment>
            <FontAwesomeIcon
                icon={faSmile}
                aria-describedby={id}
                onClick={handleClick}
                color="rgb(250,199,94)"
                style={{
                    fontSize: "30px",
                    cursor: "pointer",
                }}
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <EmojiPicker
                    onEmojiClick={(_e, emojiObject) => setText((pre) => pre + emojiObject.emoji)}
                />
            </Popover>
        </Fragment>
    );
};

export default Emoji;
