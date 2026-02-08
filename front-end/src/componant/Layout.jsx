import React, { useState } from "react";
import { Outlet } from "react-router";

import UserTopPaner from "./UserTopPaner";
import NavBar from "./NavBar";

const Layout = (props) => {
    return (
        <>
            <UserTopPaner data={props} />
            <NavBar />
            <Outlet />
        </>
    );
};

export default Layout;
