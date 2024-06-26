import express from "express";
import { newPost, updatepost } from "../controllers/postController.js";
import { checkAndRenewToken, isAdmin } from "../middleware/validate-token.js";

const router = express.Router();

router.post("/create", checkAndRenewToken, isAdmin, newPost);
router.put("/update/:id", checkAndRenewToken, updatepost)

export default router;