import { StyleSheet, View } from "react-native";
import { List, MD3DarkTheme, Text } from "react-native-paper";

interface RepositoryItemProps {
  name: string;
  description: string;
  stargazers_count: number;
}

export const RepositoryItem = ({
  name,
  description,
  stargazers_count,
}: RepositoryItemProps) => (
  <List.Item
    testID="repository-item"
    style={styles.listItem}
    title={name}
    description={description}
    right={() => (
      <View style={styles.rightIconWrapper}>
        <Text>{stargazers_count}</Text>
        <List.Icon icon="star" />
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: MD3DarkTheme.colors.background,
  },
  rightIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});
