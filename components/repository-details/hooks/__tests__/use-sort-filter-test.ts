import { renderHook, act } from "@testing-library/react-native";
import { useSortFilter } from "../use-sort-filter";

const makeRepo = (
  overrides: Partial<{
    id: number;
    name: string;
    stargazers_count: number;
    language: string;
    updated_at: string;
  }>,
) => ({
  id: 1,
  name: "repo",
  description: null,
  stargazers_count: 0,
  language: "TypeScript",
  updated_at: "2024-01-01T00:00:00Z",
  owner: { login: "user", avatar_url: "" },
  ...overrides,
});

const repos = [
  makeRepo({ id: 1, name: "alpha", stargazers_count: 5, language: "TypeScript", updated_at: "2024-01-01T00:00:00Z" }),
  makeRepo({ id: 2, name: "beta", stargazers_count: 15, language: "JavaScript", updated_at: "2024-03-01T00:00:00Z" }),
  makeRepo({ id: 3, name: "gamma", stargazers_count: 10, language: "TypeScript", updated_at: "2024-02-01T00:00:00Z" }),
];

describe("useSortFilter", () => {
  it("defaults to stars_desc sort", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    expect(result.current.sort).toBe("stars_desc");
    expect(result.current.filteredAndSorted[0].name).toBe("beta");
  });

  it("sorts by stars ascending", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setSort("stars_asc"));

    expect(result.current.filteredAndSorted[0].name).toBe("alpha");
    expect(result.current.filteredAndSorted[2].name).toBe("beta");
  });

  it("sorts by name ascending (A→Z)", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setSort("name_asc"));

    expect(result.current.filteredAndSorted.map((r) => r.name)).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
  });

  it("sorts by name descending (Z→A)", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setSort("name_desc"));

    expect(result.current.filteredAndSorted.map((r) => r.name)).toEqual([
      "gamma",
      "beta",
      "alpha",
    ]);
  });

  it("sorts by recently updated", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setSort("updated_desc"));

    expect(result.current.filteredAndSorted[0].name).toBe("beta");
    expect(result.current.filteredAndSorted[2].name).toBe("alpha");
  });

  it("filters by language", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setLanguageFilter("TypeScript"));

    expect(result.current.filteredAndSorted.length).toBe(2);
    expect(
      result.current.filteredAndSorted.every((r) => r.language === "TypeScript"),
    ).toBe(true);
  });

  it("returns all repos when language filter is cleared (null)", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setLanguageFilter("TypeScript"));
    act(() => result.current.setLanguageFilter(null));

    expect(result.current.filteredAndSorted.length).toBe(3);
  });

  it("applies sort within a filtered set", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setLanguageFilter("TypeScript"));
    act(() => result.current.setSort("name_desc"));

    const names = result.current.filteredAndSorted.map((r) => r.name);
    expect(names).toEqual(["gamma", "alpha"]);
  });

  it("exposes available languages sorted alphabetically", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    expect(result.current.availableLanguages).toEqual([
      "JavaScript",
      "TypeScript",
    ]);
  });

  it("excludes repos without a language from availableLanguages", () => {
    const reposWithNull = [
      ...repos,
      makeRepo({ id: 4, name: "delta", language: "" }),
    ];

    const { result } = renderHook(() => useSortFilter(reposWithNull));

    expect(result.current.availableLanguages).not.toContain("");
  });

  it("defaults languageFilter to null", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    expect(result.current.languageFilter).toBeNull();
  });

  it("returns empty results for a language with no repos", () => {
    const { result } = renderHook(() => useSortFilter(repos));

    act(() => result.current.setLanguageFilter("Go"));

    expect(result.current.filteredAndSorted).toEqual([]);
  });
});
