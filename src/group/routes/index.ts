import express from "express";
import { GroupService } from "../service/group.service";
import { BadRequestException } from "../../common/http.exceptions";

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

router.post("/remove-user", async (req, res) => {
  const groupService = GroupService.getInstance();
  try {
    const result = await groupService.removeUserFromGroup(
      req.body.groupId,
      req.body.userId
    );
    return res.json(result);
  } catch (error) {
    // NOTE: Do not return actual error to the client, to not expose any sensitive information
    console.error(error);
    if (error instanceof BadRequestException) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/add-user", async (req, res) => {
  const groupService = GroupService.getInstance();
  try {
    const result = await groupService.addUserToGroup(
      req.body.groupId,
      req.body.userId
    );
    return res.json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof BadRequestException) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as groupRoutes };
