import { renderHook } from "@testing-library/react-hooks";
import { useUsers } from "./use-users";

jest.mock("@tanstack/react-query", () => {
  const original = jest.requireActual("@tanstack/react-query");
  return {
    ...original,
    QueryClient: jest.fn().mockImplementation(() => ({
      fetchQuery: jest.fn(),
    })),
  };
});

jest.mock("@/app/services/GithubService", () => {
  return {
    GithubService: jest.fn().mockImplementation(() => ({
      getUserProfile: jest.fn(),
    })),
  };
});

describe("useUsers hook", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current.githubUsers).toEqual([]);
    expect(result.current.isGithubProfilesLoading).toBe(false);
    expect(typeof result.current.fetchUsers).toBe("function");
  });
});
