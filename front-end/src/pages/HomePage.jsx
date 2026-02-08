import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const HomePage = (props) => {
    return (
        <div className="min-h-screen flex flex-col">
            {props &&
                props.docs.map((ele) => {
                    return (
                        <Link key={ele._id} to={`/${ele.link}`}>
                            {ele.title}
                        </Link>
                    );
                })}
        </div>
    );
};

export default HomePage;
