import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../../data-source";
import { Group } from "../entity/group.entity";
import { GroupDto } from "../dto/group.dto";

export class GroupService {
  private static instance: GroupService;

  private constructor() {}

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
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get groups");
    }
  }
}
