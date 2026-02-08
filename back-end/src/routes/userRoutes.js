import express from "express";
import {
    getMe,
    getUser,
    getAllUsers,
    editUserInfo,
} from "../controlers/userController.js";
import {
    sginUp,
    logIn,
    logOut,
    forgetPassword,
    resetPassword,
    protect,
    updatePassword,
    restractTo,
    deletUser,
    openRoutes,
} from "../controlers/authControl.js";

const router = express.Router();

//router.param('id', userCtrl.checkId); //check id valdation once using middleware
router.post("/sginup", sginUp);
router.post("/login", logIn);
router.post("/forgetpassword", forgetPassword);
router.patch("/resetpassword/:token", resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.get("/openRoutes", openRoutes);
router.post("/logout", logOut);
router.patch("/updatepassword", updatePassword);
router.get("/me", getMe, getUser);
router.get("/", restractTo("admin"), getAllUsers);
router.delete("/delete_user/:id", restractTo("admin"), deletUser);
router.route("/:id").get(restractTo("admin"), getUser).patch(editUserInfo);

export default router;
