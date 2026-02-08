import React, { useState } from "react";
import { Outlet } from "react-router";

import UserTopPaner from "./UserTopPaner";
import NavBar from "./NavBar";

const Layout = ( props) => {
    const handelAuth = (data) => {
        props.appAuth(data);
    };
    return (
        <>
            <UserTopPaner data={props} onAuth={handelAuth} />
            <NavBar />
            <Outlet />
        </>
    );
};

export default Layout;
