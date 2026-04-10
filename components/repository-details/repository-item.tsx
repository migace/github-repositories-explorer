import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { List, MD3DarkTheme, Text } from "react-native-paper";

interface RepositoryItemProps {
  name: string;
  description: string;
  stargazers_count: number;
}

const StarCount = ({ count }: { count: number }) => (
  <View style={styles.rightIconWrapper}>
    <Text>{count}</Text>
    <List.Icon icon="star" />
  </View>
);

export const RepositoryItem = memo(
  ({ name, description, stargazers_count }: RepositoryItemProps) => {
    const renderRight = useCallback(
      () => <StarCount count={stargazers_count} />,
      [stargazers_count],
    );

    return (
      <List.Item
        testID="repository-item"
        style={styles.listItem}
        title={name}
        description={description}
        right={renderRight}
      />
    );
  },
);

RepositoryItem.displayName = "RepositoryItem";

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
