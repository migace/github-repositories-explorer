import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, MD3DarkTheme, TextInput } from "react-native-paper";

interface ISearchUsersProps {
  isGithubProfilesLoading: boolean;
  fetchUsers: (username: string) => void;
}

export const SearchUsers = ({
  isGithubProfilesLoading,
  fetchUsers,
}: ISearchUsersProps) => {
  const [githubProfile, setGithubProfile] = useState("");

  return (
    <View>
      <TextInput
        label="Github profile"
        value={githubProfile}
        onChangeText={(value) => setGithubProfile(value)}
        style={styles.searchInput}
      />
      <Button
        dark
        style={styles.searchButton}
        textColor={MD3DarkTheme.colors.background}
        mode="text"
        icon="card-search-outline"
        loading={isGithubProfilesLoading}
        onPress={() => fetchUsers(githubProfile)}
      >
        Search
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: 20,
    alignSelf: "stretch",
  },
  searchButton: {
    alignSelf: "stretch",
  },
});
