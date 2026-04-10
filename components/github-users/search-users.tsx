import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, IconButton, Text, TextInput, useTheme } from "react-native-paper";

interface ISearchUsersProps {
  isGithubProfilesLoading: boolean;
  onClick: (username: string) => void;
  history: string[];
  onHistorySelect: (term: string) => void;
  onHistoryClear: () => void;
}

export const SearchUsers = ({
  isGithubProfilesLoading,
  onClick,
  history,
  onHistorySelect,
  onHistoryClear,
}: ISearchUsersProps) => {
  const [githubProfile, setGithubProfile] = useState("");
  const { colors } = useTheme();

  const handleSearch = () => {
    if (githubProfile.trim()) onClick(githubProfile.trim());
  };

  const handleHistorySelect = (term: string) => {
    setGithubProfile(term);
    onClick(term);
    onHistorySelect(term);
  };

  return (
    <View>
      <TextInput
        label="Github profile"
        value={githubProfile}
        onChangeText={setGithubProfile}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        style={styles.searchInput}
      />
      <Button
        dark
        style={styles.searchButton}
        textColor={colors.background}
        mode="text"
        icon="card-search-outline"
        loading={isGithubProfilesLoading}
        onPress={handleSearch}
      >
        Search
      </Button>

      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text
              variant="labelSmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              Recent searches
            </Text>
            <IconButton
              icon="close"
              size={14}
              onPress={onHistoryClear}
              accessibilityLabel="Clear search history"
            />
          </View>
          <View style={styles.chips}>
            {history.map((term) => (
              <Chip
                key={term}
                compact
                onPress={() => handleHistorySelect(term)}
                style={styles.chip}
              >
                {term}
              </Chip>
            ))}
          </View>
        </View>
      )}
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
  historyContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    height: 28,
  },
});
