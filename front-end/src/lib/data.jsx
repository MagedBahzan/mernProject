import api from "./axios";
export const data = api.get("/main/news");
export const openRoutes =  api.get("/main/user/openRoutes");



