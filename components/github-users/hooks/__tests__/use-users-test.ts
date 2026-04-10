import { renderHook } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useUsers } from "../use-users";

jest.mock("@/app/services/GithubService", () => {
  return {
    GithubService: jest.fn().mockImplementation(() => ({
      getUserProfile: jest.fn(),
    })),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = "QueryClientWrapper";
  return Wrapper;
};

describe("useUsers hook", () => {
  it("should initialize with default values when no username provided", () => {
    const { result } = renderHook(() => useUsers(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.githubUsers).toEqual([]);
    expect(result.current.isGithubProfilesLoading).toBe(false);
    expect(typeof result.current.fetchUsers).toBe("function");
  });
});
