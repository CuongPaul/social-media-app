import React, { useContext } from "react";
import { Typography } from "@material-ui/core";

import { UserContext } from "../../../../App";

const CustomHeaderText = ({ body }) => {
    const { userState } = useContext(UserContext);

    return (
        <Typography>
            <b>{userState?.currentUser?.name}</b>
            {body?.feelings ? (
                <>
                    &nbsp; is feeling <b>{body?.feelings}</b>
                </>
            ) : null}
            {body?.tag_friends.length ? (
                <>
                    {` with `}
                    <b>
                        {body?.tag_friends.map((u) => (
                            <> &nbsp;{u.name},</>
                        ))}
                    </b>
                </>
            ) : null}
            {body?.location ? (
                <>
                    {` at `} <b>{body?.location} </b>
                </>
            ) : null}
        </Typography>
    );
};

export default CustomHeaderText;
