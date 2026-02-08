import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const UpdateDocument = (props) => {
    return (
        <div className="min-h-screen flex flex-col">
            {props &&
                props.docs.map((ele) => {
                    return (
                        <Link key={ele._id} to={`/update-document/${ele.link}`}>
                            {ele.title}
                        </Link>
                    );
                })}
        </div>
    );
};

export default UpdateDocument;
