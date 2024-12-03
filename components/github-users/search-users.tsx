import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, MD3DarkTheme, TextInput } from "react-native-paper";

interface ISearchUsersProps {
  isGithubProfilesLoading: boolean;
  onClick: (username: string) => void;
}

export const SearchUsers = ({
  isGithubProfilesLoading,
  onClick,
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
        onPress={() => onClick(githubProfile)}
      >
        Search
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 8,
    alignSelf: "stretch",
  },
  searchButton: {
    alignSelf: "stretch",
  },
});
