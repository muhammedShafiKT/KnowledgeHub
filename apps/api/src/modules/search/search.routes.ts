import { Router } from "express";
import { searchDocument } from "./search.controller.js";
import { authenticate } from "../../utils/auth.middleware.js";

const router = Router();

router.post(
  "/document",
  authenticate,
  searchDocument
);

export default router;