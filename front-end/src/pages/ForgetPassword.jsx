import React, { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const ForgetPassword = () => {
        const [email, setEmail] = useState("");
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!email.trim()) {
                toast.error("all feilds are required!");
                return;
            }
            try {
                await api.post("main/user/forgetpassword", {
                    email,
                });
                toast.success("email send");
            } catch (error) {
                console.log("failed to send email!");
                toast.error("failed to send email!");
            }
    };
    return (
        <>
            <div>ForgetPassword</div>
            <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                    <input
                        type="email"
                        value={email}
                        placeholder="enter email"
                        onChange={(e) => setEmail(e.target.value)}
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

export default ForgetPassword;
