import express from "express";
import { userRoutes } from "./user/routes";
import { groupRoutes } from "./group/routes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/groups", groupRoutes);

export { router as apiRoutes };
