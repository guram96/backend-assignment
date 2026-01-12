import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/user.entity";
import { UserDto } from "../dto/user.dto";
import { UpdateUserStatusesDto } from "../dto/update-user-statuses.dto";
import { NotFoundException } from "../../common/http.exceptions";

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

  async updateUserStatuses(statuses: UpdateUserStatusesDto[]) {
    // NOTE: this is a good case to background job processing, but we are out of time.
    // with background processing we could see individual user status updates as they happen, retry if failed,
    // and it would improve performance as well.
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        for (const status of statuses) {
          const user = await transactionalEntityManager.findOne(User, {
            where: { id: status.userId },
          });
          if (!user) {
            throw new NotFoundException("User not found");
          }
          await transactionalEntityManager.update(User, status.userId, {
            status: status.status,
          });
        }
      }
    );
    // NOTE: we could return the updates users here to indicate success, but maybe in the future.
    return statuses;
  }
}
