import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/User.entity";
import { UserDto } from "../dto/User.dto";

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getAllUsers(query) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      const allUsers = await AppDataSource.manager.find(User, {
        skip,
        take: limit,
      });

      const usersDto: UserDto[] = allUsers.map((user) =>
        plainToInstance(UserDto, user, { excludeExtraneousValues: true })
      );

      return {
        data: usersDto,
        page,
        limit,
        total: usersDto.length,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get users");
    }
  }
}
