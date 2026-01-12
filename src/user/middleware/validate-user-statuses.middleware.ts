import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { UpdateUserStatusesDto } from "../dto/update-user-statuses.dto";

export async function validateUserStatusesMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!Array.isArray(req.body)) {
      res.status(400).json({ message: "Request body must be an array" });
      return;
    }

    const validatedStatuses: UpdateUserStatusesDto[] = [];
    for (const status of req.body) {
      const validatedStatus = plainToInstance(UpdateUserStatusesDto, status, {
        excludeExtraneousValues: true,
      });
      await validateOrReject(validatedStatus);
      validatedStatuses.push(validatedStatus);
    }

    // Attach validated data to request object
    req.body = validatedStatuses;
    next();
  } catch (error) {
    console.error(error);
    // NOTE: Do not return actual error to the client, to not expose any sensitive information
    if (Array.isArray(error)) {
      res.status(400).json({ message: error.map((e) => e.constraints) });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
