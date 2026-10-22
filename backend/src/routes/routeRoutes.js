import express from "express";
import { listRoutes, getRouteById, createRoute, updateRoute, deleteRoute } from "../controllers/routeController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);
router.get("/", listRoutes);
router.get("/:id", getRouteById);
router.post("/", requireRole("admin"), createRoute);
router.put("/:id", requireRole("admin"), updateRoute);
router.delete("/:id", requireRole("admin"), deleteRoute);
export default router;
