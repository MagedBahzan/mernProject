import express from "express";
import {
    getALLNews,
    getNewsCategory,
    setAuther,
    createNews,
    setNewLink,
    getNews,
    setDateModified,
    editNewsInfo,
    deletNews,
} from "../controlers/newsController.js";
import { protect, restractTo } from "../controlers/authControl.js";

const router = express.Router();

router.route("/").get(getALLNews).post(
    //only admin
    protect,
    restractTo("admin"),
    setAuther,
    createNews
);
router.route("/:id").get(getNewsCategory);
router.route("/title/:id").get(getNews).patch(
    //only admin
    protect,
    restractTo("admin"),
    setDateModified,
    editNewsInfo 
);
router.delete(
    "/delete_news/:id", //only admin
    protect,
    restractTo("admin"),
    deletNews
);

export default router;
