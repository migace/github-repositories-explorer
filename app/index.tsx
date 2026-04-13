import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { IconButton, Text, useTheme } from "react-native-paper";
import { GithubUsers } from "@/components/github-users/github-users";
import { useUsers } from "@/components/github-users/hooks/use-users";
import { SearchUsers } from "@/components/github-users/search-users";
import { useSearchHistory } from "@/components/github-users/hooks/use-search-history";
import { ErrorState } from "@/components/error-state";
import { useAppTheme } from "@/contexts/theme-context";
import { useMemo, useState } from "react";

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

  const dynamicStyles = useMemo(
    () => ({
      wrapper: { flex: 1, backgroundColor: colors.background } as const,
      searchWrapper: {
        backgroundColor: colors.surface,
        borderBottomColor: colors.outline,
      } as const,
      emptyIcon: { color: colors.onSurfaceVariant } as const,
      emptyTitle: { color: colors.onBackground, textAlign: "center" } as const,
      emptySubtitle: {
        color: colors.onSurfaceVariant,
        textAlign: "center",
        marginTop: 4,
      } as const,
    }),
    [colors],
  );

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
      return <GithubUsers users={githubUsers} />;
    }
    if (!username) {
      return (
        <View style={styles.emptyState} accessibilityRole="summary">
          <Text
            style={[styles.emptyIcon, dynamicStyles.emptyIcon]}
            accessibilityElementsHidden
          >
            🔍
          </Text>
          <Text
            variant="titleMedium"
            style={dynamicStyles.emptyTitle}
            accessibilityRole="header"
          >
            Search GitHub users
          </Text>
          <Text variant="bodyMedium" style={dynamicStyles.emptySubtitle}>
            Enter a username to explore their repositories
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={dynamicStyles.wrapper}>
      <Stack.Screen
        options={{
          title: "GitHub Explorer",
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.onSurface,
          headerTitleStyle: { fontWeight: "bold" },
          headerRight: () => <HeaderRight />,
          headerShadowVisible: false,
        }}
      />

      <View style={[styles.searchWrapper, dynamicStyles.searchWrapper]}>
        <SearchUsers
          isGithubProfilesLoading={isGithubProfilesLoading}
          onClick={handleSearch}
          history={history}
          onHistorySelect={handleSearch}
          onHistoryClear={clearHistory}
        />
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
});
