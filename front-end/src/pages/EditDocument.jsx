import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";

const EditDocument = () => {
    const navigate = useNavigate();
    const parm = useParams();
    const [documentData, setdocumentData] = useState(null);
    const [title, setNewTitle] = useState("");
    const [content, setNewContent] = useState("");
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get(
                    `/main/news/${parm.id}`
                );
                setdocumentData(res.data.data.doc);
            } catch (error) {
                console.log("error fetching data");
            }
        };
        fetchDocs();
    }, [parm.id]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`main/news/${documentData._id}`, {
                title: title ? title : documentData.title,
                content: content ? content : documentData.content,
            });
            toast.success("document updated");
            navigate("/update-document");
        } catch (error) {
            console.log(error.response.data);
            toast.error(`${error.response.data.message}`);
        }
    };
    return (
        <>
            {documentData && (
                <>
                    <div>
                        <p>{documentData.author[0].name}</p>
                        <p>puplished at || {documentData.datePublished}</p>
                    </div>
                    <div>
                        <h1>{documentData.title}</h1>
                        <div className="form-control mb-4">
                            <input
                                type="text"
                                value={title}
                                placeholder="enter new title"
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <p>{documentData.content}</p>
                        <div className="form-control mb-4">
                            <input
                                type="text"
                                value={content}
                                placeholder="enter new content"
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                        </div>
                    </div>
                    <br />
                    {documentData.content2 && (
                        <>
                            <p>{documentData.content2}</p>
                            <br />
                        </>
                    )}
                    {documentData.content3 && <p>{documentData.content3}</p>}
                </>
            )}
            <form onSubmit={handleSubmit}>
                <button type="submit">submit</button>
            </form>
        </>
    );
};

export default EditDocument;
