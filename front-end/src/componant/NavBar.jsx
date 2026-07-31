import React, { useState } from "react";
import { Link, useParams } from "react-router";

const NavBar = (props) => {
    const parm = useParams();
    const [navItems, setNavItems] = useState([]);
    const setItems = async () => {
        try {
            let items = [];
            await props.docs.map((ele) => {
                !items.includes(ele.category) ? items.push(ele.category) : null;
            });
            setNavItems(items);
        } catch (er) {
            return;
        }
    };
    !navItems.length > 0 && setItems();
    const navLinks = navItems
        ? navItems.map((ele) => {
              return (
                  <li key={ele}>
                      <Link to={`/${ele}`}>{ele}</Link>
                  </li>
              );
          })
        : null;
    return (
        <>
            <div className="navbar bg-base-100">
                <div className="navbar-start w-2/12">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost lg:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link to={"/"}>Home</Link>
                            </li>
                            <li>
                                <Link to={"/Terms-of-Use"}>Terms-of-Use</Link>
                            </li>
                            <li>
                                <Link to={"/Privacy-Policy"}>
                                    Privacy Policy
                                </Link>
                            </li>
                            {navLinks}
                        </ul>
                    </div>
                </div>
                <div className="navbar-start w-10/12 hidden lg:flex">
                    <ul className="menu menu-lg menu-horizontal px-1">
                        <li>
                            <Link to={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link to={"/Terms-of-Use"}>Terms-of-Use</Link>
                        </li>
                        <li>
                            <Link to={"/Privacy-Policy"}>Privacy Policy</Link>
                        </li>
                        {navLinks}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NavBar;
