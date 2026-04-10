import React from "react";
import { render } from "@testing-library/react-native";
import { RepositoriesList } from "../repositories-list";

const noop = jest.fn();

const defaultProps = {
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: noop,
};

describe("RepositoriesList", () => {
  const mockRepositories = [
    { id: 1, name: "repo1", description: "First repository", stargazers_count: 10 },
    { id: 2, name: "repo2", description: "Second repository", stargazers_count: 5 },
  ];

  it("renders repository items when data is provided", () => {
    const { getByText } = render(
      <RepositoriesList {...defaultProps} userRepositories={mockRepositories} />,
    );

    expect(getByText("repo1")).toBeTruthy();
    expect(getByText("repo2")).toBeTruthy();
  });

  it("displays a message when no repositories are available", () => {
    const { getByText } = render(
      <RepositoriesList {...defaultProps} userRepositories={[]} />,
    );

    expect(getByText("No repositories available")).toBeTruthy();
  });

  it("renders the correct number of repository items", () => {
    const { getAllByTestId } = render(
      <RepositoriesList {...defaultProps} userRepositories={mockRepositories} />,
    );

    expect(getAllByTestId("repository-item").length).toBe(mockRepositories.length);
  });
});
