import React, { useReducer } from "react";
import { Redirect, Route } from "react-router-dom";

import { UserReducer, initialUserState } from "../context/UserContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [userState] = useReducer(UserReducer, initialUserState);

    return (
        <Route
            {...rest}
            render={(props) =>
                userState.isLoggedIn ? <Component {...rest} {...props} /> : <Redirect to="/" />
            }
        />
    );
};

export default ProtectedRoute;
