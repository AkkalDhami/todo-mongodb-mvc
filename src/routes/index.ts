import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import oauthRoutes from "./oauth.routes";
import todoRoutes from "./todo.routes";

const router = Router();

router.use("/v1/health", healthRoutes);
router.use("/v1/auth", authRoutes);
router.use("/auth", oauthRoutes);

router.use("/v1/todos", todoRoutes);

export default router;
