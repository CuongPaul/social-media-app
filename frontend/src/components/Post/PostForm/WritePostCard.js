import React, { useContext } from "react";
import { Paper, Avatar } from "@material-ui/core";

import AvartarText from "../../UI/AvartarText";
import PostFormCard from "./PostDialog/PostFormCard";
import { UIContext, UserContext } from "../../../App";

const PostCard = () => {
    const { uiState } = useContext(UIContext);
    const { userState } = useContext(UserContext);

    return (
        <div>
            <Paper
                style={{
                    maxWidth: "100%",
                    padding: "16px",
                    backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    {userState.currentUser.profile_pic ? (
                        <Avatar>
                            <img
                                alt="avatar"
                                src={userState.currentUser.profile_pic}
                                width="100%"
                                height="100%"
                            />
                        </Avatar>
                    ) : (
                        <AvartarText
                            text={userState?.currentUser?.name}
                            backgroundColor={userState?.currentUser?.active ? "seagreen" : "tomato"}
                        />
                    )}
                    <div style={{ width: "100%", marginLeft: "16px", marginRight: "16px" }}>
                        <PostFormCard />
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export default PostCard;
