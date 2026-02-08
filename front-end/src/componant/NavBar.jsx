import React from "react";
import { Link } from "react-router";

const NavBar = () => {
    return (
        <>
            <div className="flex items-center justify-around">
                <nav className="navbar bg-base-100">
                    <Link to={"/"} className="menu menu-horizontal px-1">
                        home
                    </Link>
                    <Link
                        to={"/Terms-of-Use"}
                        className="menu menu-horizontal px-1"
                    >
                        Terms-of-Use
                    </Link>
                    <Link
                        to={"/Privacy-Policy"}
                        className="menu menu-horizontal px-1"
                    >
                        Privacy-Policy
                    </Link>
                </nav>
            </div>
        </>
    );
};

export default NavBar;
