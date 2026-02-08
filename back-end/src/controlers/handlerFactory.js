import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import ApiFeaturs from "../utils/apiFeaturs.js";

// Create new document
export const createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        doc.save();

        res.status(201).json({
            status: "succes",
            data: {
                doc,
            },
        });
    });

// Get all Docs from DB
export const getAllDocs = (Model) =>
    catchAsync(async (req, res, next) => {
        //get is used to send data to users from server 'reversed way "user ask data from the server"'
        const featurs = new ApiFeaturs(Model.find(), req.query)
            .filtre()
            .sort()
            .limiting()
            .pagenation();

        const allDocs = await featurs.query;
        res.status(200).json({
            status: "succes",
            data: {
                results: allDocs.length,
                allDocs,
            },
        });
    });

// Get one doc from DB
export const getOneDoc = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findOne({ link : req.params.id });
        if (!doc) {
            return next(new AppError(`Document dos not exist`, 404));
        } else {
            res.status(200).json({
                status: "succes",
                data: {
                    doc,
                },
            });
        }
    });
export const getUserData = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findOne({ _id : req.params.id });
        if (!doc) {
            return next(new AppError(`Document dos not exist`, 404));
        } else {
            res.status(200).json({
                status: "succes",
                data: {
                    doc,
                },
            });
        }
    });

// Deleting documents
export const deletOne = (Model) =>
    catchAsync(async (req, res, next) => {
        //const doc = await Model.findOneAndDelete({ _id: req.params.id }); //when deleting all the document
        const doc = await Model.findOne({ _id: req.params.id }); // only make it not active
        doc.activation = false;
        await doc.save({ validateBeforeSave: false });
        if (!doc) {
            return next(new AppError(`document dos not exist`, 404));
        } else {
            res.status(204).json({
                status: "succes",
                data: null,
            });
        }
    });
// Edit doc info
export const editInfo = (Model) =>
    catchAsync(async (req, res, next) => {
        if (
            req.body.password ||
            req.body.passwordConfirm ||
            req.body.role ||
            req.body.activation
        ) {
            return next(
                new AppError(`Error, doesn't allawed to do this action`, 403)
            );
        }
        const doc = await Model.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ); //when using name
        if (!doc) {
            return next(new AppError(`document dos't exist`, 404));
        } else {
            res.status(200).json({
                status: "succes",
                data: {
                    doc,
                },
            });
        }
    });

//gh repo clone MagedBahzan/maine
