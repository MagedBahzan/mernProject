import express from "express";
// import routes from "./routes/routes.js";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/DB.js";
import userRouter from "./routes/userRoutes.js";
import newsRouter from "./routes/newsRouter.js";
import AppError from "./utils/appErrors.js";
import appErrorHandeler from "./controlers/errorControl.js";

// Any error handeling
process.on("uncaughtException", (err) => {
    console.log("uncaughtException >> shuting Dowin");
    process.exit();
});

dotenv.config();

const app = express();
//glable middelware
app.use(cookieParser());
// app.use(
//     cors({
//         origin: "http://localhost:5173",
//         credentials: true,
//         // Access-Control-Allow-Credentials : true
//     })
// );
const corsOptions = {
    origin: "http://localhost:5173", // Allow only this origin
    methods: ["GET", "POST", "DELETE","PATCH","DEL"], // Allowed HTTP methods
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`req mothod is:${req.method} , req url is:${req.url}`);
    next();
});
//connect to database
// set Security HTTP headers
app.use(helmet());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
    hpp({
        whitelist: ["year", "rated", "runtime"],
    })
);
// limiting requistes from the same IP
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "too many requests for this IP, please tray agane in an hour",
});
app.use("/", limiter);

app.use("/api/v1/main/user", userRouter);
app.use("/api/v1/main/news", newsRouter);
// handling unhandel router =>  when user enter wrong url
// this code must be the last code always
app.all("*", (req, res, next) => {
    // use the class AppError
    next(
        new AppError(`can't laod resourses, wrong url ${req.originalUrl}`, 404)
    );
});

//glabal error handiling  => more advanced
app.use(appErrorHandeler);

const port = process.env.PORT || 5002;
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}...`);
    });
});

// handel rejection  -- when can not connect to the DB
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("unhandledRejection >> shuting Dowin");
    appServer.close(() => {
        process.exit();
    });
});
