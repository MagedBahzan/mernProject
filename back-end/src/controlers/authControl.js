import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { deletOne } from "./handlerFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import sendEmail from "../utils/email.js";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
//0000000000
const createSendToken = (data, user, statusCode, res) => {
    const token = signToken(user._id);
    const cookiesOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_TOKEN_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };
    if (process.env.NODE_ENV === "production") cookiesOptions.Secure = true;

    //send cookie
    res.cookie("jwt", token, cookiesOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: "succes",
        token,
        data: data
            ? {
                  user,
              }
            : undefined,
    });
};

export const protect = catchAsync(async (req, res, next) => {
    //1) check if it's there is token
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    //2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) check if user has been leaved or removed
    const checkUser = await User.findById(decoded.id);

    if (!checkUser) {
        return next(new AppError("This user has no longer exist", 401));
    }

    //4) check if user changed password after token was issued

    if (checkUser.checkPassChangDate(decoded.iat)) {
        return next(new AppError("user had changed password recently", 401));
    }
    //GARNT ACCESS TO PROTECTED ROUTES
    req.user = checkUser;
    next();
});

export const restractTo = (...roles) => {
    return (req, res, next) => {
        //roles = ['admin', 'user'] ,   role = 'user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403
                )
            );
        }
        next();
    };
};

export const sginUp = catchAsync(async (req, res, next) => {
    //post is used to send data to the server 'user send data to prosses in the server app'
    const newUser = await User.create({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passChangDat: req.body.passChangDat,
    });
    // createSendToken(true, newUser, 201, res);
    res.status(201).json({
        status: "succes, accaunt created",
    });
});

export const logIn = catchAsync(async (req, res, next) => {
    // exports.logIn = (req, res, next) => {
    //post is used to send data to the server 'user send data to prosses in the server app'
    const { email, password } = req.body;
    //check if email & password exist
    if (!email || !password) {
        return next(new AppError("pleas provide Email or Password", 404));
    }
    //check if user xist & password correct
    const user = await User.findOne({ email }).select("+password");
    const checkPass = user
        ? await user.correctPassword(password, user.password)
        : false;
    if (!user || !checkPass) {
        return next(new AppError("Incorrect email or password", 401));
    }
    //if evry thing is ok , send token to clint
    createSendToken(true, user, 200, res);
});

export const logOut = catchAsync(async (req, res, next) => {
    res.cookie("jwt", "logedOut", {
        expires: new Date(Date.now() + 1),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    res.status(200).json({
        status: "succes",
    });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
    //get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("Email is not correct", 404));
    }
    //create randon reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //send it to user's email
    const resetUrl = `${req.protocol}://${process.env.FRONT_DOMAIM}/resetpassword/${resetToken}`;

    const message = `forget your password ? submit a pacth request with your new password and password confirm to \n ${resetUrl} \n if you did not aske for reset password please ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: "your password reset token valid for 10 min",
            message,
        });

        res.status(200).json({
            status: "succes",
            message: "token sent to email",
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiers = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                "ther was an error during sending the email, please try agine later",
                500
            )
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    // get user based on the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiers: { $gt: Date.now() },
    });
    // if token has not expired, and user exist then set new
    if (!user) {
        return next(new AppError("Token has expired!", 400));
    }

    // update passChangDate prop for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passChangDate = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpiers = undefined;
    await user.save();

    res.status(200).json({
        status: "succes",
        message: "plese login agine",
    });
});

export const updatePassword = catchAsync(async (req, res, next) => {
    const curentUSer = await User.findById(req.user.id).select("+password");

    //check if currentPassword && email exist
    if (!req.body.oldPassword) {
        return next(new AppError("pleas provide valid Password", 404));
    }
    const checkPass = curentUSer
        ? await curentUSer.correctPassword(
              req.body.oldPassword,
              curentUSer.password
          )
        : false;

    if (!curentUSer || !checkPass) {
        return next(new AppError("Incorrect email or password", 401));
    }

    curentUSer.password = req.body.password;
    curentUSer.passwordConfirm = req.body.passwordConfirm;
    curentUSer.passChangDate = Date.now();
    await curentUSer.save();

    res.status(200).json({
        status: "succes",
        message: "plese login agine",
    });
});

export const openRoutes = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: "succes",
    });
})

export const deletUser = deletOne(User);
