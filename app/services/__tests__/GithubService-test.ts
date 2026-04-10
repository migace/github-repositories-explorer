import { GithubService } from "../GithubService";

const mockFetch = jest.fn();

describe("GithubService", () => {
  const mockBaseUrl = "https://api.github.com";
  let githubService: GithubService;

  beforeEach(() => {
    mockFetch.mockClear();
    globalThis.fetch = mockFetch as typeof fetch;
    githubService = new GithubService(mockBaseUrl);
  });

  describe("fetchJson", () => {
    it("fetches data from the provided URL", async () => {
      const mockResponse = { key: "value" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await githubService["fetchJson"]<{ key: string }>(
        `${mockBaseUrl}/example-endpoint`
      );

      expect(mockFetch).toHaveBeenCalledWith(`${mockBaseUrl}/example-endpoint`, {
        headers: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it("throws an error when the fetch response is not ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(
        githubService["fetchJson"](`${mockBaseUrl}/example-endpoint`)
      ).rejects.toThrow("Error fetching data: 404 Not Found");
    });
  });

  describe("getUserProfile", () => {
    it("fetches user profiles with the correct URL", async () => {
      const mockResponse = {
        items: [
          { login: "user1", id: 1, avatar_url: "http://example.com/avatar1" },
          { login: "user2", id: 2, avatar_url: "http://example.com/avatar2" },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const username = "testUser";
      const result = await githubService.getUserProfile(username);

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/search/users?q=${username}&per_page=5`,
        { headers: {} }
      );
      expect(result).toEqual(mockResponse.items);
    });

    it("returns an empty array when no users are found", async () => {
      const mockResponse = { items: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const username = "nonexistentUser";
      const result = await githubService.getUserProfile(username);

      expect(result).toEqual([]);
    });
  });

  describe("getRepositoriesByUsername", () => {
    it("fetches user repositories with the correct URL", async () => {
      const mockResponse = [
        { id: 1, name: "repo1" },
        { id: 2, name: "repo2" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const username = "testUser";
      const result = await githubService.getRepositoriesByUsername(username);

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/users/${username}/repos?per_page=30&page=1`,
        { headers: {} }
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws an error when the fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
        githubService.getRepositoriesByUsername("testUser")
      ).rejects.toThrow("Error fetching data: 500 Internal Server Error");
    });
  });

  describe("getRepositoryByName", () => {
    it("fetches a repository with the correct URL", async () => {
      const mockResponse = { id: 1, name: "my-repo", full_name: "octocat/my-repo" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await githubService.getRepositoryByName("octocat", "my-repo");

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/repos/octocat/my-repo`,
        { headers: {} }
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws an error when the repository is not found", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(
        githubService.getRepositoryByName("octocat", "nonexistent")
      ).rejects.toThrow("Error fetching data: 404 Not Found");
    });

    it("includes auth header when token is provided", async () => {
      const serviceWithToken = new GithubService(mockBaseUrl, "my-token");
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: "repo" }),
      });

      await serviceWithToken.getRepositoryByName("octocat", "repo");

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/repos/octocat/repo`,
        { headers: { Authorization: "Bearer my-token" } }
      );
    });
  });
});
