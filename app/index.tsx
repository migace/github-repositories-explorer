import { ScrollView, StyleSheet, View } from "react-native";

import { Stack } from "expo-router";
import { MD3DarkTheme } from "react-native-paper";
import { Image } from "expo-image";
import { GithubUsers } from "@/components/github-users/github-users";
import { useUsers } from "@/components/github-users/hooks/use-users";
import { SearchUsers } from "@/components/github-users/search-users";
import { ErrorState } from "@/components/error-state";
import { useState } from "react";

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const { githubUsers, isGithubProfilesLoading, isGithubProfilesError } =
    useUsers(username);

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
    <View>
      <Stack.Screen
        options={{
          title: "Home",
          headerStyle: { backgroundColor: MD3DarkTheme.colors.background },
          headerTintColor: MD3DarkTheme.colors.onBackground,
          headerTitleStyle: {
            fontWeight: "bold",
          },
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
        onClick={(value: string) => setUsername(value)}
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
  },
  bannerImage: {
    height: 300,
  },
  users: {
    alignSelf: "stretch",
  },
});
