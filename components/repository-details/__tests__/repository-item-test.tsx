import React from "react";
import { render } from "@testing-library/react-native";
import { RepositoryItem } from "../repository-item";

describe("RepositoryItem", () => {
  const mockProps = {
    name: "Test Repository",
    description: "This is a test repository",
    stargazers_count: 42,
    language: null as string | null,
    username: "testuser",
  };

  it("renders the repository name", () => {
    const { getByText } = render(<RepositoryItem {...mockProps} />);
    expect(getByText("Test Repository")).toBeTruthy();
  });

  it("renders the repository description", () => {
    const { getByText } = render(<RepositoryItem {...mockProps} />);
    expect(getByText("This is a test repository")).toBeTruthy();
  });

  it("renders the correct star count", () => {
    const { getByText } = render(<RepositoryItem {...mockProps} />);
    expect(getByText("42")).toBeTruthy();
  });

  it("renders the testID for the item", () => {
    const { getByTestId } = render(<RepositoryItem {...mockProps} />);
    expect(getByTestId("repository-item")).toBeTruthy();
  });
});
