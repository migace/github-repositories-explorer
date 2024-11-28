import React from "react";
import { render } from "@testing-library/react-native";
import { RepositoriesList } from "./repositories-list";

describe("RepositoriesList", () => {
  const mockRepositories: any[] = [
    { id: 1, name: "repo1", description: "First repository" },
    { id: 2, name: "repo2", description: "Second repository" },
  ];

  it("renders repository items when data is provided", () => {
    const { getByText } = render(
      <RepositoriesList userRepositories={mockRepositories} />,
    );

    expect(getByText("repo1")).toBeTruthy();
    expect(getByText("repo2")).toBeTruthy();
  });

  it("displays a message when no repositories are available", () => {
    const { getByText } = render(<RepositoriesList userRepositories={[]} />);

    expect(getByText("No repositories available")).toBeTruthy();
  });

  it("renders the correct number of repository items", () => {
    const { getAllByTestId } = render(
      <RepositoriesList userRepositories={mockRepositories} />,
    );

    expect(getAllByTestId("repository-item").length).toBe(
      mockRepositories.length,
    );
  });
});
