import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim() ||
            !passwordConfirm.trim() ||
            !age.trim() ||
            !gender.trim()
        ) {
            toast.error("all feilds are required!");
            return;
        }
        try {
            await api.post("/main/user/sginup",
                { name, age, email, password, passwordConfirm, gender });
            toast.success("account created, plase login");
            navigate("/");
        } catch (error) {
            toast.error("failed to create account!");
        }
    };
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
                        type="text"
                        value={name}
                        placeholder="enter your name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        value={gender}
                        placeholder="enter your gender"
                        onChange={(e) => setGender(e.target.value)}
                        required
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="number"
                        value={age}
                        placeholder="enter your age"
                        onChange={(e) => setAge(e.target.value)}
                        required
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
                <div className="form-control mb-4">
                    <input
                        type="password"
                        value={passwordConfirm}
                        placeholder="enter passwordConfirm"
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">create your account</button>
                </div>
            </form>
            <div>
                <p>allready have accaunt</p>
                <Link to={"/login"}>login</Link>
            </div>
        </>
    );
}

export default SignUp;
