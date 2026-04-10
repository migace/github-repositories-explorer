import { ScrollView, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { GithubUsers } from "@/components/github-users/github-users";
import { useUsers } from "@/components/github-users/hooks/use-users";
import { SearchUsers } from "@/components/github-users/search-users";
import { useSearchHistory } from "@/components/github-users/hooks/use-search-history";
import { ErrorState } from "@/components/error-state";
import { useAppTheme } from "@/contexts/theme-context";
import { useState } from "react";

const HeaderRight = () => {
  const { isDark, toggleTheme } = useAppTheme();
  return (
    <IconButton
      icon={isDark ? "weather-sunny" : "weather-night"}
      onPress={toggleTheme}
      accessibilityLabel="Toggle theme"
    />
  );
};

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const { githubUsers, isGithubProfilesLoading, isGithubProfilesError } =
    useUsers(username);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { colors } = useTheme();

  const handleSearch = (value: string) => {
    setUsername(value);
    addToHistory(value);
  };

  const renderContent = () => {
    if (isGithubProfilesError) {
      return (
        <ErrorState message="Failed to load users. Check your connection or try again." />
      );
    }
    if (githubUsers.length > 0) {
      return (
        <ScrollView style={styles.users}>
          <GithubUsers users={githubUsers} />
        </ScrollView>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: "GitHub Explorer",
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.onSurface,
          headerTitleStyle: { fontWeight: "bold" },
          headerRight: () => <HeaderRight />,
        }}
      />
      <Image
        style={styles.bannerImage}
        source={require("@/assets/images/github-profiles.png")}
        contentFit="cover"
        transition={1000}
      />

      <SearchUsers
        isGithubProfilesLoading={isGithubProfilesLoading}
        onClick={handleSearch}
        history={history}
        onHistorySelect={handleSearch}
        onHistoryClear={clearHistory}
      />

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    alignItems: "flex-start",
    flexDirection: "column",
    flex: 1,
  },
  bannerImage: {
    height: 200,
  },
  users: {
    alignSelf: "stretch",
  },
});
