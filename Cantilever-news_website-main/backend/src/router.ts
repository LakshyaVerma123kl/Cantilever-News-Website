import { Router } from "express";
import { registerUser, verifyUser } from "./Controllers/registerUser";
import {
  forgetPassword,
  getUserDetails,
  loginUser,
  resetPassword,
} from "./Controllers/login";
import { handleRequest } from "./Middleware/logger";

const router = Router();

router.post("/verifyUser", verifyUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPassword);
router.put("/resetPassword", resetPassword);

router.use(handleRequest);
router.get("/user", getUserDetails);

export default router;
