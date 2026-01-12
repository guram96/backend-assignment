import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";

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
}
