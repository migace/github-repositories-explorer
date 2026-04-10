import { renderHook, waitFor } from "@testing-library/react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { githubService } from "@/app/services/GithubService";
import { useUserRepositories } from "../use-user-repositories";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));
jest.mock("@/app/services/GithubService", () => ({
  githubService: {
    getRepositoriesByUsername: jest.fn(),
  },
}));

describe("useUserRepositories", () => {
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
        isError: false,
        error: null,
      };
    });

    const { result } = renderHook(() => useUserRepositories());

    await waitFor(() => {
      expect(result.current.userRepositories.length).toBeGreaterThan(0);
    });

    expect(result.current.userRepositories).toEqual(mockRepositories);
    expect(result.current.isUserRepositoryFetching).toBe(false);
    expect(githubService.getRepositoriesByUsername).toHaveBeenCalledWith(
      "testUser"
    );
  });

  it("should not fetch repositories if username is missing", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});

    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.userRepositories).toEqual([]);
    expect(result.current.isUserRepositoryFetching).toBe(false);
    expect(githubService.getRepositoriesByUsername).not.toHaveBeenCalled();
  });

  it("should handle loading state correctly", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      username: "testUser",
    });

    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isFetching: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.isUserRepositoryFetching).toBe(true);
    expect(result.current.userRepositories).toEqual([]);
  });

  it("should expose error state when fetch fails", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      username: "testUser",
    });

    const mockError = new Error("Network error");
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isFetching: false,
      isError: true,
      error: mockError,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.isUserRepositoryError).toBe(true);
    expect(result.current.userRepositoryError).toBe(mockError);
  });
});
