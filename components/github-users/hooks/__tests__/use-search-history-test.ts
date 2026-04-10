import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchHistory } from "../use-search-history";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("useSearchHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  it("initializes with empty history when storage is empty", async () => {
    const { result } = renderHook(() => useSearchHistory());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });

    expect(result.current.history).toEqual([]);
  });

  it("loads persisted history from AsyncStorage on mount", async () => {
    const stored = ["octocat", "torvalds"];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(stored));

    const { result } = renderHook(() => useSearchHistory());

    await waitFor(() => {
      expect(result.current.history).toEqual(stored);
    });
  });

  it("adds a new term to the front of history", async () => {
    const { result } = renderHook(() => useSearchHistory());

    await act(async () => {
      await result.current.addToHistory("octocat");
    });

    expect(result.current.history[0]).toBe("octocat");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@search_history",
      JSON.stringify(["octocat"]),
    );
  });

  it("deduplicates: moves existing term to front without creating duplicates", async () => {
    const stored = ["octocat", "torvalds"];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(stored));

    const { result } = renderHook(() => useSearchHistory());
    await waitFor(() => expect(result.current.history).toEqual(stored));

    await act(async () => {
      await result.current.addToHistory("torvalds");
    });

    expect(result.current.history[0]).toBe("torvalds");
    expect(result.current.history.filter((h) => h === "torvalds").length).toBe(1);
    expect(result.current.history.length).toBe(2);
  });

  it("ignores empty strings", async () => {
    const { result } = renderHook(() => useSearchHistory());

    await act(async () => {
      await result.current.addToHistory("");
    });

    expect(result.current.history).toEqual([]);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("ignores whitespace-only strings", async () => {
    const { result } = renderHook(() => useSearchHistory());

    await act(async () => {
      await result.current.addToHistory("   ");
    });

    expect(result.current.history).toEqual([]);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("caps history at 10 entries", async () => {
    const stored = Array.from({ length: 10 }, (_, i) => `user${i}`);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(stored));

    const { result } = renderHook(() => useSearchHistory());
    await waitFor(() => expect(result.current.history.length).toBe(10));

    await act(async () => {
      await result.current.addToHistory("newuser");
    });

    expect(result.current.history.length).toBe(10);
    expect(result.current.history[0]).toBe("newuser");
    expect(result.current.history).not.toContain("user9");
  });

  it("clears all history and removes from AsyncStorage", async () => {
    const stored = ["octocat", "torvalds"];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(stored));

    const { result } = renderHook(() => useSearchHistory());
    await waitFor(() => expect(result.current.history).toEqual(stored));

    await act(async () => {
      await result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@search_history");
  });
});
