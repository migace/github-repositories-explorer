import React from "react";
import { render } from "@testing-library/react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import RepoDetails from "../repository-detail";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/app/services/GithubService", () => ({
  githubService: {
    getRepositoryByName: jest.fn(),
  },
}));

jest.mock("expo-image", () => ({
  Image: () => null,
}));

jest.mock("@/components/loading-state", () => ({
  LoadingState: () => null,
}));

jest.mock("@/components/error-state", () => ({
  ErrorState: ({ message }: { message: string }) => {
    const ReactLib = require("react");
    const { Text } = require("react-native");
    return ReactLib.createElement(Text, { testID: "error-message" }, message);
  },
}));

const mockRepository = {
  id: 1,
  name: "my-repo",
  full_name: "octocat/my-repo",
  description: "A test repository",
  stargazers_count: 42,
  forks_count: 10,
  open_issues_count: 3,
  language: "TypeScript",
  topics: ["react", "typescript"],
  created_at: "2023-01-15T00:00:00Z",
  updated_at: "2024-06-01T00:00:00Z",
  html_url: "https://github.com/octocat/my-repo",
  owner: {
    login: "octocat",
    avatar_url: "https://github.com/octocat.png",
  },
};

describe("RepoDetails screen", () => {
  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      username: "octocat",
      repo: "my-repo",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state while fetching", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    const { queryByTestId } = render(<RepoDetails />);

    expect(queryByTestId("error-message")).toBeNull();
  });

  it("renders error state when fetch fails", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });

    const { getByTestId } = render(<RepoDetails />);

    expect(getByTestId("error-message").props.children).toBe(
      "Failed to load repository details.",
    );
  });

  it("renders error state when data is missing", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
    });

    const { getByTestId } = render(<RepoDetails />);

    expect(getByTestId("error-message")).toBeTruthy();
  });

  it("renders repository name", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getAllByText } = render(<RepoDetails />);

    expect(getAllByText("my-repo").length).toBeGreaterThan(0);
  });

  it("renders repository description", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getByText } = render(<RepoDetails />);

    expect(getByText("A test repository")).toBeTruthy();
  });

  it("renders star count", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getByText } = render(<RepoDetails />);

    expect(getByText("42")).toBeTruthy();
  });

  it("renders forks count", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getByText } = render(<RepoDetails />);

    expect(getByText("10")).toBeTruthy();
  });

  it("renders open issues count", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getByText } = render(<RepoDetails />);

    expect(getByText("3")).toBeTruthy();
  });

  it("renders the owner login", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getByText } = render(<RepoDetails />);

    expect(getByText("octocat")).toBeTruthy();
  });

  it("renders topics when present", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getByText } = render(<RepoDetails />);

    expect(getByText("react")).toBeTruthy();
    expect(getByText("typescript")).toBeTruthy();
  });

  it("does not render Topics section when topics array is empty", () => {
    const repoWithoutTopics = { ...mockRepository, topics: [] };
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: repoWithoutTopics,
    });

    const { queryByText } = render(<RepoDetails />);

    expect(queryByText("Topics")).toBeNull();
  });

  it("does not render description section when description is null", () => {
    const repoWithoutDescription = { ...mockRepository, description: null };
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: repoWithoutDescription,
    });

    const { queryByText } = render(<RepoDetails />);

    expect(queryByText("A test repository")).toBeNull();
  });

  it("renders View on GitHub chip", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRepository,
    });

    const { getByText } = render(<RepoDetails />);

    expect(getByText("View on GitHub")).toBeTruthy();
  });
});
