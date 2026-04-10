import { memo } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View } from "react-native";
import { List, MD3DarkTheme } from "react-native-paper";
import { RepositoryItem } from "./repository-item";
import type { IGithubRepositoryDto } from "@/app/types/dto";
import type { FetchNextPageOptions } from "@tanstack/react-query";

interface IRepositoriesListProps {
  userRepositories: Pick<
    IGithubRepositoryDto,
    "id" | "name" | "description" | "stargazers_count"
  >[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: FetchNextPageOptions) => void;
}

export const RepositoriesList = memo(
  ({
    userRepositories,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }: IRepositoriesListProps) => (
    <FlatList
      data={userRepositories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <RepositoryItem
          name={item.name}
          description={item.description ?? ""}
          stargazers_count={item.stargazers_count}
        />
      )}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <List.Subheader>No repositories available</List.Subheader>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator
              color={MD3DarkTheme.colors.primary}
              size="small"
            />
          </View>
        ) : null
      }
      contentContainerStyle={styles.wrapper}
      accessible
      accessibilityLabel="List of user repositories"
    />
  ),
);

RepositoriesList.displayName = "RepositoriesList";

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
