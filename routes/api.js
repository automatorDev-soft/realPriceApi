import express from "express";
import { Router } from "express";
import { getAllData } from "../controllers/ScrapingDataController.js";

const router = Router();

router.get("/getAllData/:product", getAllData);
router.get("/testRoute", (req, res) => {
  res.json({ products: "hello mate test route is working" });
});

export default router;
