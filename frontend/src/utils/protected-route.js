import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const token = localStorage.getItem("token");

    const renderComponent = () => (token ? <Component /> : <Redirect to="/" />);

    return <Route {...rest} render={renderComponent} />;
};

export default ProtectedRoute;
