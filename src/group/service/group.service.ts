import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../../data-source";
import { Group } from "../entity/group.entity";
import { GroupDto } from "../dto/group.dto";
import { UserService } from "../../user/service/user.service";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/http.exceptions";

export class GroupService {
  private static instance: GroupService;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): GroupService {
    if (!GroupService.instance) {
      GroupService.instance = new GroupService();
    }
    return GroupService.instance;
  }

  async getAllGroups(query) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const allGroups = await AppDataSource.manager.find(Group, {
      skip,
      take: limit,
      relations: ["users"],
    });

    // convert groups to DTOs, this will allow us to hide sensitive data
    const groupsDto: GroupDto[] = allGroups.map((group) =>
      plainToInstance(GroupDto, group, { excludeExtraneousValues: true })
    );

    return {
      data: groupsDto,
      page,
      limit,
      total: groupsDto.length,
    };
  }

  async removeUserFromGroup(groupId: number, userId: number) {
    const group = await AppDataSource.manager.findOne(Group, {
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException("Group not found");
    }
    if (!group.users.some((user) => user.id === userId)) {
      throw new BadRequestException("User not in this group");
    }
    group.users = group.users.filter((user) => user.id !== userId);

    if (group.users.length === 0) {
      group.status = "Empty";
    }

    await AppDataSource.manager.save(group);
    return group;
  }

  async addUserToGroup(groupId: number, userId: number) {
    const group = await AppDataSource.manager.findOne(Group, {
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException("Group not found");
    }
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.groups.some((group) => group.id === groupId)) {
      throw new BadRequestException("User already in this group");
    }
    group.users.push(user);
    if (group.users.length > 0) {
      group.status = "NotEmpty";
    }
    await AppDataSource.manager.save(group);
    return group;
  }
}
