import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useQuery } from "@tanstack/react-query";
import { githubService } from "@/app/services/GithubService";
import { useUsers } from "../use-users";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/app/services/GithubService", () => ({
  githubService: {
    getUserProfile: jest.fn(),
  },
}));

jest.mock("@/hooks/use-debounce", () => ({
  useDebounce: (value: string) => value,
}));

const mockUsers = [
  { id: 1, login: "octocat", avatar_url: "https://example.com/avatar1.png" },
  { id: 2, login: "octokitten", avatar_url: "https://example.com/avatar2.png" },
];

describe("useUsers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return default values when no username is provided", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useUsers(""));

    expect(result.current.githubUsers).toEqual([]);
    expect(result.current.isGithubProfilesLoading).toBe(false);
    expect(result.current.isGithubProfilesError).toBe(false);
  });

  it("should disable query when username is empty", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    renderHook(() => useUsers(""));

    const queryConfig = (useQuery as jest.Mock).mock.calls[0][0];
    expect(queryConfig.enabled).toBe(false);
  });

  it("should enable query when username is provided", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    });

    renderHook(() => useUsers("octocat"));

    const queryConfig = (useQuery as jest.Mock).mock.calls[0][0];
    expect(queryConfig.enabled).toBe(true);
  });

  it("should use correct query key based on username", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    });

    renderHook(() => useUsers("octocat"));

    const queryConfig = (useQuery as jest.Mock).mock.calls[0][0];
    expect(queryConfig.queryKey).toEqual(["users", "octocat"]);
  });

  it("should call githubService.getUserProfile via queryFn", () => {
    const controller = new AbortController();
    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      queryFn({ signal: controller.signal });
      return { data: mockUsers, isLoading: false, isError: false };
    });

    renderHook(() => useUsers("octocat"));

    expect(githubService.getUserProfile).toHaveBeenCalledWith(
      "octocat",
      controller.signal,
    );
  });

  it("should return users when query succeeds", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useUsers("octocat"));

    expect(result.current.githubUsers).toEqual(mockUsers);
    expect(result.current.githubUsers).toHaveLength(2);
  });

  it("should expose loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(() => useUsers("octocat"));

    expect(result.current.isGithubProfilesLoading).toBe(true);
    expect(result.current.githubUsers).toEqual([]);
  });

  it("should expose error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    const { result } = renderHook(() => useUsers("octocat"));

    expect(result.current.isGithubProfilesError).toBe(true);
    expect(result.current.githubUsers).toEqual([]);
  });

  it("should update query key when username changes", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    const { rerender } = renderHook(
      ({ username }: { username: string }) => useUsers(username),
      { initialProps: { username: "octocat" } },
    );

    expect((useQuery as jest.Mock).mock.calls[0][0].queryKey).toEqual([
      "users",
      "octocat",
    ]);

    rerender({ username: "torvalds" });

    const lastCall = (useQuery as jest.Mock).mock.calls;
    expect(lastCall[lastCall.length - 1][0].queryKey).toEqual([
      "users",
      "torvalds",
    ]);
  });
});
