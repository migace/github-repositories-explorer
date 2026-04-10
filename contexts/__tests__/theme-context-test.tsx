import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useAppTheme } from "../theme-context";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ThemeProvider, null, children);

describe("ThemeContext / useAppTheme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it("defaults to dark mode when storage is empty", async () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@theme_mode");
    });

    expect(result.current.isDark).toBe(true);
  });

  it("restores dark theme from AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("dark");

    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.isDark).toBe(true);
    });
  });

  it("restores light theme from AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("light");

    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.isDark).toBe(false);
    });
  });

  it("toggles from dark to light", async () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => expect(result.current.isDark).toBe(true));

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDark).toBe(false);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@theme_mode", "light");
  });

  it("toggles from light to dark", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("light");

    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => expect(result.current.isDark).toBe(false));

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDark).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@theme_mode", "dark");
  });

  it("exposes a toggleTheme function", async () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => expect(result.current.isDark).toBe(true));

    expect(typeof result.current.toggleTheme).toBe("function");
  });

  it("exposes the current theme object", async () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => expect(result.current.isDark).toBe(true));

    expect(result.current.theme).toBeDefined();
    expect(typeof result.current.theme).toBe("object");
  });

  it("theme changes when toggled", async () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });

    await waitFor(() => expect(result.current.isDark).toBe(true));
    const darkTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(darkTheme);
  });
});
