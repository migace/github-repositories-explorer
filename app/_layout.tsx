import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { expo } from "../app.json";

import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { AppRegistry } from "react-native";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function RootLayout() {
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
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <PaperProvider theme={MD3DarkTheme}>
        <Stack>
          <Stack.Screen
            name="repository-details"
            options={{ title: "Repository details" }}
          />
          <Stack.Screen
            name="+not-found"
            options={{ title: "Page Not Found" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </PersistQueryClientProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
