import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { expo } from "../app.json";

import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { AppRegistry } from "react-native";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useAppTheme } from "@/contexts/theme-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { theme } = useAppTheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="repository-details"
          options={{ title: "Repository details" }}
        />
        <Stack.Screen
          name="repo-details"
          options={{ title: "Repository" }}
        />
        <Stack.Screen
          name="+not-found"
          options={{ title: "Page Not Found" }}
        />
      </Stack>
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

AppRegistry.registerComponent(expo.name, () => RootLayout);
