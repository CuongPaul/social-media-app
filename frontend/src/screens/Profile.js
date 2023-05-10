import { useParams } from "react-router-dom";
import React from "react";

import UserProfile from "../components/Profile/UserProfile";

const Profile = () => {
    const params = useParams();

    return (
        <div>
            <UserProfile userId={params.userId} />
        </div>
    );
};

export default Profile;
