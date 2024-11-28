import { ScrollView, StyleSheet, View } from "react-native";

import { Stack } from "expo-router";
import { MD3DarkTheme } from "react-native-paper";
import { Image } from "expo-image";
import { GithubUsers } from "@/components/github-users/github-users";
import { useUsers } from "@/components/github-users/hooks/use-users";
import { SearchUsers } from "@/components/github-users/search-users";

export default function HomeScreen() {
  const { githubUsers, isGithubProfilesLoading, fetchUsers } = useUsers();

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
        fetchUsers={fetchUsers}
      />

      <View style={styles.content}>
        {githubUsers.length ? (
          <ScrollView style={styles.users}>
            <GithubUsers users={githubUsers} />
          </ScrollView>
        ) : null}
      </View>
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
