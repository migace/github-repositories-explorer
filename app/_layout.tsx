import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { ErrorBoundary } from "@/components/error-boundary";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useAppTheme } from "@/contexts/theme-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("403") || message.includes("429")) return false;
        return failureCount < 3;
      },
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { theme, isThemeLoaded } = useAppTheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && isThemeLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isThemeLoaded]);

  if (!loaded || !isThemeLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <ErrorBoundary>
        <Stack>
          <Stack.Screen
            name="repository-details"
            options={{ title: "Repository details" }}
          />
          <Stack.Screen
            name="repository-detail"
            options={{ title: "Repository" }}
          />
          <Stack.Screen
            name="+not-found"
            options={{ title: "Page Not Found" }}
          />
        </Stack>
      </ErrorBoundary>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <AppContent />
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
