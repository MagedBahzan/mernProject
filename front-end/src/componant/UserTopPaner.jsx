import { Link, useNavigate } from "react-router";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";

const UserTopPaner = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setLogedUser] = useState("");
    useEffect(() => {
        const getuser = async () => {
            api.get("/main/user/me")
                .then((res) => {
                    setLogedUser(res.data.data.doc);
                    setIsLoggedIn(true);
                })
                .catch(() => {
                    setIsLoggedIn(false);
                });
        };
        props.data.data ? getuser() : null;
    }, [props]);
    //logOut function
    const logOut = async () => {
        await api.post("/main/user/logout");
        (() => {
            toast.success("loged out");
            setIsLoggedIn(false);
            props.onAuth(false);
            navigate("/");
        })();
    };
    return (
        <>
            <div className="navbar bg-red-700 text-neutral-content h-24">
                <div className="flex-1 px-5">
                    <Link to={"/"} className="btn btn-ghost text-4xl">
                        daisyUI
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    {isLoggedIn ? (
                        <div className="dropdown dropdown-end px-5">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex justify-between h-20 w-56 btn btn-ghost avatar"
                            >
                                <div className="text-2xl content-center h-20">{user.name}</div>
                                <div className="w-16 rounded-full">
                                    <img alt="avatar" src={`${user.avatar}`} />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-2"
                            >
                                <li>
                                    <Link className="menu menu-horizontal px-1 text-neutral text-xl">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/creat-document"}
                                        className="menu menu-horizontal px-1 text-neutral text-xl"
                                    >
                                        create new document
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/update-document"}
                                        className="menu menu-horizontal px-1 text-neutral text-xl"
                                    >
                                        update document
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/updatepassword"}
                                        className="menu menu-horizontal px-1 text-neutral text-xl"
                                    >
                                        updatepassword
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={logOut}
                                        className="menu menu-horizontal px-1 text-neutral text-xl"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div>
                                <Link
                                    to={"/login"}
                                    className="btn btn-ghost text-xl"
                                >
                                    login
                                </Link>
                            </div>
                            <div>
                                <Link
                                    to={"/Signup"}
                                    className="btn btn-ghost text-xl"
                                >
                                    SignUp
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserTopPaner;
