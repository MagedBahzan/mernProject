import News from "./../models/newsModel.js";
import {
    getAllDocs,
    getOneDoc,
    createOne,
    editInfo,
    deletOne,
} from "./handlerFactory.js";
import catchAsync from "./../utils/catchAsync.js";
import User from "../models/userModel.js";

export const setAuther = async (req, res, next) => {
    const author = await User.findById(req.user._id);
    req.body.author = author;
    next();
};
export const setDateModified = async (req, res, next) => {
    req.body.dateModified = Date.now();
    next();
};
export const setNewLink = async (req, res, next) => {
    req.body.link = req.body.title.replaceAll(" ","-");
    next();
};

export const getALLNews = getAllDocs(News);

export const getNews = getOneDoc(News);

export const createNews = createOne(News);

export const editNewsInfo = editInfo(News);

export const deletNews = deletOne(News);

export const getNewsStatus = catchAsync(async (req, res, next) => {
    const stats = await News.aggregate([
        // This array contan stages that data go throw to get process
        {
            // $match: { title: { $eq: req.query.title } }, //Filters documents based on a specified query predicate. Matched documents are passed to the next pipeline stage.
            $group: {
                //summry
                _id: "$category", //grouping all query based on this intry
                numNewss: { $sum: 1 }, //how many doc in the database "movie"
                oldestNews: { $min: "$datePublished" },
                newstNews: { $max: "$datePublished" },
            },
        },
        {
            $sort: { numNewss: -1 },
        },
        {
            $match: { _id: { $ne: null } }, //not equel
        },
    ]);
    res.status(200).json({
        status: "succes",
        data: {
            docs: stats.length,
            stats,
        },
    });
});
