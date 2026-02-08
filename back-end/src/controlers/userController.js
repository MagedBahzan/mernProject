import User from '../models/userModel.js';
import { getAllDocs, getUserData, editInfo } from "./handlerFactory.js";
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next()
};

export const getAllUsers = getAllDocs(User);

export const getUser = getUserData(User);

export const editUserInfo = editInfo(User); 
