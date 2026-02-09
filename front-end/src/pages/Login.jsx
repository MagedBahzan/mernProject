import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isLogedIn, setIsLogedIn] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            toast.error("all feilds are required!");
            return;
        }
        try {
            await api.post("/main/user/login", { email, password });
            setIsLogedIn(true);
            toast.success("loged in");
            navigate("/");
        } catch (error) {
            setIsLogedIn(false);
            toast.error("failed to login!");
        }
    };
    onLogin(isLogedIn);
    return (
        <>
            <form onSubmit={handleSubmit} autoComplete="on">
                <div className="form-control mb-4">
                    <input
                        type="email"
                        value={email}
                        placeholder="enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="password"
                        value={password}
                        placeholder="enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">login</button>
                </div>
            </form>
            <div>
                <Link to={"/forget-password"}>forget your password</Link>
            </div>
        </>
    );
};

export default Login;
