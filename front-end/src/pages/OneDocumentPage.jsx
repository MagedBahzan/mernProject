import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../lib/axios";

const OneDocumentPage = () => {
    const parm = useParams();
    const [documentData, setdocumentData] = useState(null);
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get(
                    `http://127.0.0.1:5001/api/v1/main/news/${parm.id}`
                );
                setdocumentData(res.data.data.doc);
            } catch (error) {
                console.log("error fetching data");
            }
        };
        fetchDocs();
    }, [parm.id]);
    return (
        <>
            <div>OneDocumentPage</div>
            {documentData && (
                <>
                    <div>
                        <p>{documentData.author[0].name}</p>
                        <p>puplished at || {documentData.datePublished}</p>
                    </div>
                    <h1>{documentData.title}</h1>
                    <p>{documentData.content}</p>
                    <br/>
                    <p>{documentData.content2}</p>
                    <br/>
                    <p>{documentData.content3}</p>
                </>
            )}
        </>
    );
};

export default OneDocumentPage;
