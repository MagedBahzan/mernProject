import express from "express";
import {
    getALLNews,
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
// router.route("/get-movie").get(getNewsStatus);
router.route("/:id").get(getNews).patch(
    //only admin
    protect,
    restractTo("admin"),
    setDateModified,
    setNewLink,
    editNewsInfo
);
router.delete(
    "/delete_news/:id", //only admin
    protect,
    restractTo("admin"),
    deletNews
);

export default router;
