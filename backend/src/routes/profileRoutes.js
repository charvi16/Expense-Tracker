import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getProfile, updateProfile, uploadPhoto } from "../controllers/profileController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.put("/photo", protect, upload.single("image"), uploadPhoto);


export default router;
