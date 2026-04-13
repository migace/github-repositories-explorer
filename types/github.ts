import { GithubUserDto } from "./dto";

export interface GithubUsersResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubUserDto[];
}
