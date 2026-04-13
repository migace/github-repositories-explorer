import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Chip,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

interface SearchUsersProps {
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
}: SearchUsersProps) => {
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
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <TextInput
          label="Search GitHub user"
          value={githubProfile}
          onChangeText={setGithubProfile}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          mode="outlined"
          left={<TextInput.Icon icon="github" />}
          right={
            githubProfile.length > 0 ? (
              <TextInput.Icon
                icon="close-circle"
                onPress={() => setGithubProfile("")}
                accessibilityLabel="Clear search input"
              />
            ) : undefined
          }
          style={styles.input}
          outlineStyle={[styles.inputOutline, { borderColor: colors.outline }]}
        />
        <IconButton
          icon={isGithubProfilesLoading ? "loading" : "magnify"}
          mode="contained"
          onPress={handleSearch}
          disabled={isGithubProfilesLoading || !githubProfile.trim()}
          style={styles.searchButton}
          animated
          accessibilityLabel="Search"
          accessibilityHint="Searches for GitHub users matching your query"
        />
      </View>

      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text
              variant="labelSmall"
              style={[styles.historyLabel, { color: colors.onSurfaceVariant }]}
            >
              Recent searches
            </Text>
            <IconButton
              icon="delete-sweep-outline"
              size={16}
              onPress={onHistoryClear}
              accessibilityLabel="Clear search history"
              iconColor={colors.onSurfaceVariant}
            />
          </View>
          <View style={styles.chips}>
            {history.map((term) => (
              <Chip
                key={term}
                compact
                onPress={() => handleHistorySelect(term)}
                style={[
                  styles.chip,
                  { backgroundColor: colors.surfaceVariant },
                ]}
                textStyle={{ color: colors.onSurfaceVariant }}
                icon="history"
                accessibilityHint={`Search for ${term}`}
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
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 52,
  },
  inputOutline: {
    borderRadius: 10,
  },
  searchButton: {
    borderRadius: 10,
    margin: 0,
  },
  historyContainer: {
    marginTop: 4,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 4,
  },
  historyLabel: {
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingBottom: 4,
  },
  chip: {
    height: 30,
  },
});
