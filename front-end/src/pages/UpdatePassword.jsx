import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim() || !passwordConfirm.trim() || !oldPassword.trim()) {
            toast.error("all feilds are required!");
            return;
        }
        try {
            await api.patch('main/user/updatepassword', {
                oldPassword,
                password,
                passwordConfirm
            });
            toast.success("password changed success");
            navigate("/login");
        } catch (error) {
            console.log("failed to change password!");
            toast.error("failed to change password!");
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                    <input
                        type="password"
                        value={oldPassword}
                        placeholder="enter old password"
                        onChange={(e) => setOldPassword(e.target.value)}
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
                        placeholder="enter password confirm"
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        />
                </div>
                <div>
                    <button type="submit">submit</button>
                </div>
            </form>
        </>
    );
};

export default UpdatePassword