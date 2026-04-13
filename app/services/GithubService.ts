import { GithubRepositoryDto, GithubUserDto } from "@/types/dto";
import { GithubUsersResponse } from "@/types/github";

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

  private async fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, {
      headers: this.authHeaders,
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getUserProfile(
    username: string,
    signal?: AbortSignal,
  ): Promise<GithubUserDto[]> {
    const data = await this.fetchJson<GithubUsersResponse>(
      `${this.baseUrl}/search/users?q=${encodeURIComponent(username)}&per_page=5`,
      signal,
    );
    return data?.items || [];
  }

  async getRepositoriesByUsername(
    username: string,
    page = 1,
    perPage = 30,
    signal?: AbortSignal,
  ): Promise<GithubRepositoryDto[]> {
    return this.fetchJson<GithubRepositoryDto[]>(
      `${this.baseUrl}/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}`,
      signal,
    );
  }

  async getRepositoryByName(
    owner: string,
    repo: string,
    signal?: AbortSignal,
  ): Promise<GithubRepositoryDto> {
    return this.fetchJson<GithubRepositoryDto>(
      `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      signal,
    );
  }
}

export const githubService = new GithubService();
