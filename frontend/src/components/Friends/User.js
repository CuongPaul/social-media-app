import React, { useContext } from "react";
import { Card, Typography, CardContent } from "@material-ui/core";

import AvatarIcon from "../UI/AvatarIcon";
import { UIContext, UserContext } from "../../App";

const User = ({ user, children, setSelectedUser }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const mutualFriends = currentUser?.friends.filter((item) => user.friends.includes(item._id));

    return (
        <Card
            style={{
                padding: "16px",
                display: "flex",
                cursor: "pointer",
                minWidth: "300px",
                borderRadius: "10px",
                justifyContent: "space-between",
                backgroundColor: darkMode ? "rgb(36,37,38)" : "rgb(255,255,255)",
            }}
        >
            <div style={{ display: "flex" }} onClick={() => setSelectedUser(user)}>
                <CardContent
                    style={{
                        padding: "0px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <AvatarIcon text={user.name} imageUrl={user.avatar_image} />
                    <div
                        style={{
                            display: "flex",
                            marginLeft: "16px",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                            {user.name}
                        </Typography>
                        <Typography variant="body2">
                            {mutualFriends?.length} mutual friends
                        </Typography>
                    </div>
                </CardContent>
            </div>
            {children}
        </Card>
    );
};

export default User;
