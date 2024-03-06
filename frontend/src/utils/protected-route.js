import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ path, component: Component }) => {
    const token = localStorage.getItem("token");

    const renderComponent = () => (token ? <Component /> : <Redirect to="/" />);

    return <Route path={path} render={renderComponent} />;
};

export default ProtectedRoute;
