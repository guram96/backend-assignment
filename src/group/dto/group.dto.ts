import { IsDate, IsNumber, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { UserDto } from "../../user/dto/user.dto";

export class GroupDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => UserDto)
  users?: UserDto[];
}
