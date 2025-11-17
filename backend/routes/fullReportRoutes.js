import { getFullReport } from "../controllers/fullReportController.js";
import express from "express";

const router = express.Router();

router.get("/", getFullReport);

export default router;
