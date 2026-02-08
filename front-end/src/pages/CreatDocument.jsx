import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";

const CreatDocument = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [content2, setContent2] = useState("");
    const [content3, setContent3] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !title.trim() ||
            !category.trim() ||
            !description.trim() ||
            !content.trim()
        ) {
            toast.error("all feilds are required!");
            return;
        }
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(
                "http://127.0.0.1:5001/api/v1/main/news",
                {
                    title,
                    category,
                    description,
                    content,
                    content2,
                    content3,
                }
            );
            console.log(res.data);
            toast.success("document created successfully");
            navigate("/");
        } catch (error) {
            console.log("failed to create document!");
            toast.error("failed to create document!");
        }
    };
    return (
        <>
            <h1>CreatDocument</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        value={title}
                        placeholder="enter title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        value={category}
                        placeholder="enter category"
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="form-control mb-4">
                    <textarea
                        type="text"
                        value={description}
                        placeholder="enter description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-control mb-4">
                    <textarea
                        type="text"
                        value={content}
                        maxLength="10000"
                        placeholder="enter content"
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <br/>
                    <textarea
                        type="text"
                        value={content2}
                        maxLength="10000"
                        placeholder="contenu content"
                        onChange={(e) => setContent2(e.target.value)}
                    />
                    <br/>
                    <textarea
                        type="text"
                        value={content3}
                        placeholder="contenu content"
                        onChange={(e) => setContent3(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">submit</button>
                </div>
            </form>
        </>
    );
};

export default CreatDocument;
