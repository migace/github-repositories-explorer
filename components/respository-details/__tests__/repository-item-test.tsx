import React from "react";
import { render } from "@testing-library/react-native";
import { RepositoryItem } from "../repository-item";
import { List } from "react-native-paper";

describe("RepositoryItem", () => {
  const mockProps = {
    name: "Test Repository",
    description: "This is a test repository",
    stargazers_count: 42,
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

  it("renders the star icon", () => {
    const { UNSAFE_getByType } = render(<RepositoryItem {...mockProps} />);
    const starIcon = UNSAFE_getByType(List.Icon);

    expect(starIcon).toBeTruthy();
  });
});
