import { Expose } from "class-transformer";
import { IsEnum, IsNumber } from "class-validator";
import { userStatus } from "../types";

export class UpdateUserStatusesDto {
  @Expose()
  @IsNumber()
  userId: number;

  @Expose()
  @IsEnum(userStatus)
  status: userStatus;
}
