import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@theme_mode";

const githubDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#58a6ff",
    onPrimary: "#0d1117",
    primaryContainer: "#1f4068",
    onPrimaryContainer: "#cae3ff",
    secondary: "#3fb950",
    onSecondary: "#0d1117",
    secondaryContainer: "#1b3a23",
    onSecondaryContainer: "#b8f5c8",
    background: "#0d1117",
    onBackground: "#e6edf3",
    surface: "#161b22",
    onSurface: "#e6edf3",
    surfaceVariant: "#21262d",
    onSurfaceVariant: "#8b949e",
    outline: "#30363d",
    outlineVariant: "#21262d",
    error: "#f85149",
    onError: "#0d1117",
    errorContainer: "#5c1a18",
    onErrorContainer: "#ffc9c7",
    inverseSurface: "#e6edf3",
    inverseOnSurface: "#0d1117",
    inversePrimary: "#0969da",
    backdrop: "#0d1117",
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: "transparent",
      level1: "#161b22",
      level2: "#1c2128",
      level3: "#21262d",
    },
  },
};

const githubLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0969da",
    onPrimary: "#ffffff",
    primaryContainer: "#ddf4ff",
    onPrimaryContainer: "#0550ae",
    secondary: "#1a7f37",
    onSecondary: "#ffffff",
    secondaryContainer: "#d4f0db",
    onSecondaryContainer: "#0f5323",
    background: "#ffffff",
    onBackground: "#1f2328",
    surface: "#f6f8fa",
    onSurface: "#1f2328",
    surfaceVariant: "#eaeef2",
    onSurfaceVariant: "#656d76",
    outline: "#d0d7de",
    outlineVariant: "#eaeef2",
    error: "#cf222e",
    onError: "#ffffff",
    errorContainer: "#ffd7d9",
    onErrorContainer: "#9a1c23",
    inverseSurface: "#1f2328",
    inverseOnSurface: "#f6f8fa",
    inversePrimary: "#58a6ff",
    backdrop: "#f6f8fa",
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: "transparent",
      level1: "#f6f8fa",
      level2: "#eaeef2",
      level3: "#d0d7de",
    },
  },
};

interface ThemeContextValue {
  theme: MD3Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: githubDarkTheme,
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored !== null) setIsDark(stored === "dark");
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme: isDark ? githubDarkTheme : githubLightTheme,
      isDark,
      toggleTheme,
    }),
    [isDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
