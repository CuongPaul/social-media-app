import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../App";
import { getUserById } from "../services/UserServices";
import UserProfile from "../components/Profile/UserProfile";

const Profile = () => {
    const { userState, userDispatch } = useContext(UserContext);

    const params = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userState.currentUser.id === params.userId) {
            setUser(userState.currentUser);
        } else {
            let userIndex = userState.users.findIndex((user) => user.id === params.userId);
            if (userIndex !== -1) {
                setUser(userState.users[userIndex]);
            } else {
                getUserById(params.userId)
                    .then((res) => {
                        if (res.data) {
                            setUser(res.data.user);
                            userDispatch({ type: "ADD_USER", payload: res.data.user });
                        }
                        if (res.error) {
                            console.log(res.error);
                        }
                    })
                    .catch((err) => console.log(err));
            }
        }
    }, [params.userId, userState.currentUser, userDispatch, userState.users]);

    return <div>{user && <UserProfile user={user} />}</div>;
};

export default Profile;
