import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SortFilterBar } from "../sort-filter-bar";
import { SORT_LABELS } from "../hooks/use-sort-filter";

jest.mock("react-native-safe-area-context", () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    useSafeAreaInsets: () => insets,
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (v: typeof insets) => React.ReactNode }) => children(insets),
  };
});

const defaultProps = {
  sort: "stars_desc" as const,
  onSortChange: jest.fn(),
  languageFilter: null,
  onLanguageChange: jest.fn(),
  availableLanguages: ["JavaScript", "TypeScript"],
  totalCount: 10,
  filteredCount: 10,
};

describe("SortFilterBar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the current sort label", () => {
    const { getByText } = render(<SortFilterBar {...defaultProps} />);

    expect(getByText(SORT_LABELS["stars_desc"])).toBeTruthy();
  });

  it("renders the All filter chip", () => {
    const { getByText } = render(<SortFilterBar {...defaultProps} />);

    expect(getByText("All")).toBeTruthy();
  });

  it("renders a chip for each available language", () => {
    const { getByText } = render(<SortFilterBar {...defaultProps} />);

    expect(getByText("JavaScript")).toBeTruthy();
    expect(getByText("TypeScript")).toBeTruthy();
  });

  it("does not show count text when no language filter is active", () => {
    const { queryByText } = render(<SortFilterBar {...defaultProps} />);

    expect(queryByText(/repos/)).toBeNull();
  });

  it("shows filtered count when a language filter is active", () => {
    const { getByText } = render(
      <SortFilterBar
        {...defaultProps}
        languageFilter="TypeScript"
        filteredCount={3}
        totalCount={10}
      />,
    );

    expect(getByText("Showing 3 of 10 repos")).toBeTruthy();
  });

  it("calls onLanguageChange with null when All chip is pressed", () => {
    const onLanguageChange = jest.fn();
    const { getByText } = render(
      <SortFilterBar
        {...defaultProps}
        onLanguageChange={onLanguageChange}
        languageFilter="TypeScript"
      />,
    );

    fireEvent.press(getByText("All"));

    expect(onLanguageChange).toHaveBeenCalledWith(null);
  });

  it("calls onLanguageChange with language when a language chip is pressed", () => {
    const onLanguageChange = jest.fn();
    const { getByText } = render(
      <SortFilterBar {...defaultProps} onLanguageChange={onLanguageChange} />,
    );

    fireEvent.press(getByText("TypeScript"));

    expect(onLanguageChange).toHaveBeenCalledWith("TypeScript");
  });

  it("toggles language filter off when the active language chip is pressed again", () => {
    const onLanguageChange = jest.fn();
    const { getByText } = render(
      <SortFilterBar
        {...defaultProps}
        onLanguageChange={onLanguageChange}
        languageFilter="TypeScript"
      />,
    );

    fireEvent.press(getByText("TypeScript"));

    expect(onLanguageChange).toHaveBeenCalledWith(null);
  });

  it("renders no language chips when availableLanguages is empty", () => {
    const { getByText, queryByText } = render(
      <SortFilterBar {...defaultProps} availableLanguages={[]} />,
    );

    expect(getByText("All")).toBeTruthy();
    expect(queryByText("JavaScript")).toBeNull();
  });
});
