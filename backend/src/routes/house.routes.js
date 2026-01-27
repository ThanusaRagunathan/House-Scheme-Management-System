import express from "express";
import * as houseController from "../controllers/house.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, houseController.getAllHouses);
router.get("/:id", verifyToken, houseController.getHouseById);
router.post("/", verifyToken, houseController.createHouse);
router.put("/:id", verifyToken, houseController.updateHouse);
router.delete("/:id", verifyToken, houseController.deleteHouse);

export default router;
