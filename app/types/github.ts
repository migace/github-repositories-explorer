import { IGithubUserDto } from "./dto";

export interface IGithubUsersResponse {
  total_count: number;
  incomplete_results: boolean;
  items: IGithubUserDto[];
}
