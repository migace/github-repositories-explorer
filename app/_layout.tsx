import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { expo } from "../app.json";

import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { AppRegistry } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
