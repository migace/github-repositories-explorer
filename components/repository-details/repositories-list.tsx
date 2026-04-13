import { memo } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { List, useTheme } from "react-native-paper";
import { RepositoryItem } from "./repository-item";
import type { GithubRepositoryDto } from "@/types/dto";
import type { FetchNextPageOptions } from "@tanstack/react-query";

type RepoListItem = Pick<
  GithubRepositoryDto,
  "id" | "name" | "description" | "stargazers_count" | "language" | "updated_at"
> & {
  owner: Pick<GithubRepositoryDto["owner"], "login" | "avatar_url">;
};

interface RepositoriesListProps {
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
  }: RepositoriesListProps) => {
    const { colors } = useTheme();

    return (
      <FlashList
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
    height: 24,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
