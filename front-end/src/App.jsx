import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";

import "./index.css";
import { openRoutes, data } from "./lib/data";
import HomePage from "./pages/HomePage";
import CreatDocument from "./pages/CreatDocument";
import Layout from "./componant/Layout";
import OneDocumentPage from "./pages/OneDocumentPage";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Resetpassword from "./pages/Resetpassword";
import Updatepassword from "./pages/Updatepassword";
import UpdateDocument from "./pages/UpdateDocument";
import EditDocument from "./pages/EditDocument";
import Forbidden from "./pages/Forbidden";

const App = () => {
    const [isLoged, setIsLoged] = useState(null);
    const [docs, setDocs] = useState([]);
    const handelAuth = (data) => {
        setIsLoged(data);
    };
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await data;
                setDocs(res.data.data.allDocs);
            } catch (error) {
                console.log("error fetching data");
            }
        };
        fetchDocs();
        const fetchLog = async () => {
            try {
                await openRoutes;
                setIsLoged(true);
            } catch (error) {
                setIsLoged(false);
            }
        };
        if (!isLoged) fetchLog();
    }, []);
    return (
        <div>
            <Routes>
                <Route path="login" element={<Login onLogin={handelAuth} />} />
                <Route element={<Layout data={isLoged} appAuth={handelAuth} />}>
                    <Route
                        path="updatepassword"
                        element={isLoged ? <Updatepassword /> : <Forbidden />}
                    />
                    <Route
                        path="forget-password"
                        element={<ForgetPassword />}
                    />
                    <Route
                        path="resetpassword/:id"
                        element={<Resetpassword />}
                    />
                    <Route path="/" element={<HomePage docs={docs} />} />
                    {/* <Route path="courses">
                        <Route index element={<CoursesPage />} />
                        <Route path=":id" element={<CoursesDetailesPage />} />
                        </Route> */}
                    <Route path="/:id" element={<OneDocumentPage />} />
                    <Route
                        path="creat-document"
                        element={isLoged ? <CreatDocument /> : <Forbidden />}
                    />
                    <Route
                        path="update-document"
                        element={
                            isLoged ? (
                                <UpdateDocument docs={docs} />
                            ) : (
                                <Forbidden />
                            )
                        }
                    />
                    <Route
                        path="update-document/:id"
                        element={isLoged ? <EditDocument /> : <Forbidden />}
                    />
                    {/* <Route path="Sign-Up" element={<SignUpPage />} /> */}
                    <Route
                        path="Terms-of-Use"
                        element={<h1>Terms of Use Page</h1>}
                    />
                    <Route
                        path="Privacy-Policy"
                        element={<h1>Privacy Policy Page</h1>}
                    />
                </Route>
            </Routes>
        </div>
    );
};
export default App;
