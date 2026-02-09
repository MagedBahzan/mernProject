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
            setIsLoggedIn(false)
            props.onAuth(false);
            navigate("/");
        })();
    };
    return (
        <>
            {isLoggedIn ? (
                <div className="flex items-center justify-around">
                    <>
                        <Link
                            to={"/creat-document"}
                            className="menu menu-horizontal px-1"
                        >
                            create
                        </Link>
                        <Link
                            to={"/update-document"}
                            className="menu menu-horizontal px-1"
                        >
                            update document
                        </Link>
                        <Link
                            to={"/updatepassword"}
                            className="menu menu-horizontal px-1"
                        >
                            updatepassword
                        </Link>
                        <button
                            className="menu menu-horizontal px-1"
                            onClick={logOut}
                        >
                            logOut
                        </button>
                        ||
                        <div className="w-10">{user.name}</div>
                    </>
                </div>
            ) : (
                <div className="flex items-center">
                    <div>
                        <Link
                            to={"/login"}
                            className="menu menu-horizontal px-1"
                        >
                            login
                        </Link>
                    </div>
                    <div>
                        <Link
                            to={"/Signup"}
                            className="menu menu-horizontal px-1"
                        >
                            create accaount
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserTopPaner;
