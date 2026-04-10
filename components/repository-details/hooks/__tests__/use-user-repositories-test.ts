import { renderHook, waitFor } from "@testing-library/react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { githubService } from "@/app/services/GithubService";
import { useUserRepositories } from "../use-user-repositories";

jest.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: jest.fn(),
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));
jest.mock("@/app/services/GithubService", () => ({
  githubService: {
    getRepositoriesByUsername: jest.fn(),
  },
}));

const mockPage = [
  { id: 1, name: "repo1" },
  { id: 2, name: "repo2" },
];

describe("useUserRepositories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user repositories when username is provided", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ username: "testUser" });

    (useInfiniteQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      queryFn({ pageParam: 1 });
      return {
        data: { pages: [mockPage] },
        isFetching: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      };
    });

    const { result } = renderHook(() => useUserRepositories());

    await waitFor(() => {
      expect(result.current.userRepositories.length).toBeGreaterThan(0);
    });

    expect(result.current.userRepositories).toEqual(mockPage);
    expect(result.current.isUserRepositoryFetching).toBe(false);
    expect(githubService.getRepositoriesByUsername).toHaveBeenCalledWith(
      "testUser",
      1,
      30,
    );
  });

  it("should not fetch repositories if username is missing", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});

    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.userRepositories).toEqual([]);
    expect(result.current.isUserRepositoryFetching).toBe(false);
    expect(githubService.getRepositoriesByUsername).not.toHaveBeenCalled();
  });

  it("should handle loading state correctly", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ username: "testUser" });

    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isFetching: true,
      isError: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.isUserRepositoryFetching).toBe(true);
    expect(result.current.userRepositories).toEqual([]);
  });

  it("should expose error state when fetch fails", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ username: "testUser" });

    const mockError = new Error("Network error");
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
      error: mockError,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.isUserRepositoryError).toBe(true);
    expect(result.current.userRepositoryError).toBe(mockError);
  });

  it("should expose pagination controls", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ username: "testUser" });

    const mockFetchNextPage = jest.fn();
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [mockPage] },
      isFetching: false,
      isError: false,
      error: null,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    const { result } = renderHook(() => useUserRepositories());

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.fetchNextPage).toBe(mockFetchNextPage);
  });
});
