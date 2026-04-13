import { memo } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View } from "react-native";
import { List, useTheme } from "react-native-paper";
import { RepositoryItem } from "./repository-item";
import type { IGithubRepositoryDto } from "@/app/types/dto";
import type { FetchNextPageOptions } from "@tanstack/react-query";

type RepoListItem = Pick<
  IGithubRepositoryDto,
  "id" | "name" | "description" | "stargazers_count" | "language" | "updated_at"
> & {
  owner: Pick<IGithubRepositoryDto["owner"], "login" | "avatar_url">;
};

interface IRepositoriesListProps {
  userRepositories: RepoListItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: FetchNextPageOptions) => void;
}

const Separator = () => <View style={styles.separator} />;

export const RepositoriesList = memo(
  ({
    userRepositories,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }: IRepositoriesListProps) => {
    const { colors } = useTheme();

    return (
      <FlatList
        data={userRepositories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RepositoryItem
            name={item.name}
            description={item.description}
            stargazers_count={item.stargazers_count}
            language={item.language}
            username={item.owner.login}
          />
        )}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <List.Subheader>No repositories available</List.Subheader>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.primary} size="small" />
            </View>
          ) : null
        }
        contentContainerStyle={styles.wrapper}
        accessible
        accessibilityLabel="List of user repositories"
      />
    );
  },
);

RepositoriesList.displayName = "RepositoriesList";

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  separator: {
    height: 10,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
