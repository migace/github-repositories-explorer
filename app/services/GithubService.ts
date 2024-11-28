import { IGithubRepositoryDto, IGithubUserDto } from "../types/dto";
import { IGithubUsersResponse } from "../types/github";

export class GithubService {
  baseUrl: string;

  constructor(baseUrl = process.env.EXPO_PUBLIC_GITHUB_API_URL || "") {
    this.baseUrl = baseUrl;
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async getUserProfile(username: string): Promise<IGithubUserDto[]> {
    const data = await this.fetchJson<IGithubUsersResponse>(
      `${this.baseUrl}/search/users?q=${username}&per_page=5`,
    );
    return data?.items || [];
  }

  async getRepositoriesByUsername(
    username: string,
  ): Promise<IGithubRepositoryDto[]> {
    return this.fetchJson<IGithubRepositoryDto[]>(
      `${this.baseUrl}/users/${username}/repos`,
    );
  }
}
