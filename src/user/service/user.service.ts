import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/user.entity";
import { UserDto } from "../dto/user.dto";

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
    const allUsers = await AppDataSource.manager.find(User, {
      skip,
      take: limit,
      relations: ["groups"],
    });

    // convert users to DTOs, this will allow us to hide sensitive data
    const usersDto: UserDto[] = allUsers.map((user) =>
      plainToInstance(UserDto, user, { excludeExtraneousValues: true })
    );

    return {
      data: usersDto,
      page,
      limit,
      total: usersDto.length,
    };
  }

  async getUserById(id: number) {
    const user = await AppDataSource.manager.findOne(User, {
      where: { id },
      relations: ["groups"],
    });
    return user;
  }
}
