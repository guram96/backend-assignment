import express from "express";
import { UserService } from "../service/user.service";
import { validateUserStatusesMiddleware } from "../middleware/validate-user-statuses.middleware";

const router = express.Router();

router.get("/", async (req, res) => {
  const userService = UserService.getInstance();
  try {
    const result = await userService.getAllUsers(req.query);
    return res.json(result);
  } catch (error) {
    // NOTE: Do not return actual error to the client, to not expose any sensitive information
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/update-user-statuses",
  validateUserStatusesMiddleware,
  async (req, res) => {
    const userService = UserService.getInstance();
    try {
      // @ts-ignore
      const result = await userService.updateUserStatuses(req.body);
      return res.json(result);
    } catch (error) {
      // NOTE: Do not return actual error to the client, to not expose any sensitive information
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as userRoutes };
