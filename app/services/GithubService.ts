import { IGithubRepositoryDto, IGithubUserDto } from "../types/dto";
import { IGithubUsersResponse } from "../types/github";

export class GithubService {
  private readonly baseUrl: string;
  private readonly token: string | undefined;

  constructor(
    baseUrl = process.env.EXPO_PUBLIC_GITHUB_API_URL || "",
    token = process.env.EXPO_PUBLIC_GITHUB_TOKEN,
  ) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private get authHeaders(): HeadersInit {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, { headers: this.authHeaders });

    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
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

export const githubService = new GithubService();
