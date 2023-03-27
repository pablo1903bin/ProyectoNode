import express from "express";
import { admin } from "../controllers/propiedadController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);

export default router;
