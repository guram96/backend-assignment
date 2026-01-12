import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { GroupDto } from "../../group/dto/group.dto";
import { userStatus } from "../types";

export class UserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => GroupDto)
  groups?: GroupDto[];

  @Expose()
  @IsEnum(userStatus)
  status: userStatus;
}
