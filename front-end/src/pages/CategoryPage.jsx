import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../lib/axios";
import { Link } from "react-router";

const CategoryPage = () => {
    const parm = useParams();
    const [documentData, setdocumentData] = useState(null);
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get(
                    `http://127.0.0.1:5001/api/v1/main/news/${parm.id}`
                );
                setdocumentData(res.data.data.allDocs);
            } catch (error) {
                console.log("error fetching data");
            }
        };
        fetchDocs();
    }, [parm.id]);
    return (
        <div className="w-full px-36 py-6">
            <div className="grid grid-cols-4 gap-4">
                {documentData &&
                    documentData.map((ele) => {
                        return (
                            <Link
                                className="card bg-base-100 w-96 shadow-xl"
                                key={ele._id}
                                to={`/title/${ele.link}`}
                            >
                                <figure>
                                    <img
                                        src={`${ele.imgSrc}`}
                                        alt="Not Faound"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {ele.title}
                                        <div className="badge badge-secondary">
                                            {ele.category}
                                        </div>
                                    </h2>
                                    <p>{ele.description}</p>
                                    <div className="card-actions justify-end">
                                        <div className="badge badge-outline">
                                            Fashion
                                        </div>
                                        <div className="badge badge-outline">
                                            Products
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
};

export default CategoryPage;
