import express from "express";
import { GroupService } from "../service/group.service";

const router = express.Router();

router.get("/", async (req, res) => {
  const groupService = GroupService.getInstance();
  try {
    const result = await groupService.getAllGroups(req.query);
    return res.json(result);
  } catch (error) {
    // NOTE: Do not return actual error to the client, to not expose any sensitive information
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as groupRoutes };
