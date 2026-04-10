import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import { Link } from "expo-router";

interface RepositoryItemProps {
  name: string;
  description: string;
  stargazers_count: number;
  username: string;
}

const StarCount = ({ count }: { count: number }) => (
  <View style={styles.rightIconWrapper}>
    <Text>{count}</Text>
    <List.Icon icon="star" />
  </View>
);

export const RepositoryItem = memo(
  ({ name, description, stargazers_count, username }: RepositoryItemProps) => {
    const { colors } = useTheme();

    const renderRight = useCallback(
      () => <StarCount count={stargazers_count} />,
      [stargazers_count],
    );

    return (
      <Link
        href={{
          pathname: "/repo-details",
          params: { username, repo: name },
        }}
        asChild
      >
        <List.Item
          testID="repository-item"
          style={StyleSheet.flatten([styles.listItem, { backgroundColor: colors.background }])}
          title={name}
          description={description}
          right={renderRight}
        />
      </Link>
    );
  },
);

RepositoryItem.displayName = "RepositoryItem";

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    marginBottom: 10,
  },
  rightIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});
