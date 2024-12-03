import { renderHook } from "@testing-library/react-hooks";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { GithubService } from "@/app/services/GithubService";
import { useUserRepositories } from "../use-user-repositories";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));
jest.mock("@/app/services/GithubService");

describe("useUserRepositories", () => {
  let mockGithubService: jest.Mocked<GithubService>;

  beforeEach(() => {
    mockGithubService = new GithubService() as jest.Mocked<GithubService>;

    mockGithubService.getRepositoriesByUsername = jest.fn();

    (GithubService as jest.Mock).mockImplementation(() => mockGithubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user repositories when username is provided", async () => {
    const mockRepositories = [
      { id: 1, name: "repo1" },
      { id: 2, name: "repo2" },
    ];

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      username: "testUser",
    });

    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      queryFn();

      return {
        data: mockRepositories,
        isFetching: false,
        queryFn: jest.fn().mockResolvedValueOnce(mockRepositories),
      };
    });

    const { result, waitFor } = renderHook(() => useUserRepositories());

    await waitFor(() => {
      return result.current.userRepositories.length > 0;
    });

    expect(result.current.userRepositories).toEqual(mockRepositories);
    expect(result.current.isUserRepositoryFetching).toBe(false);
    expect(mockGithubService.getRepositoriesByUsername).toHaveBeenCalledWith(
      "testUser"
    );
  });

  it("should not fetch repositories if username is missing", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});

    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isFetching: false,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.userRepositories).toEqual([]);
    expect(result.current.isUserRepositoryFetching).toBe(false);
    expect(mockGithubService.getRepositoriesByUsername).not.toHaveBeenCalled();
  });

  it("should handle loading state correctly", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      username: "testUser",
    });

    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isFetching: true,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.isUserRepositoryFetching).toBe(true);
    expect(result.current.userRepositories).toEqual([]);
  });
});
