import express from "express";
import { addFund, getFunds, updateFundNav, } from "../controllers/fundController";
const router = express.Router();
router.post("/", addFund);
router.get("/", getFunds);
router.put("/:fundId/nav", updateFundNav);
export default router;
