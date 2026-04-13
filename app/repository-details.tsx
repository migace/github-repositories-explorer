import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { RepositoriesList } from "@/components/repository-details/repositories-list";
import { SortFilterBar } from "@/components/repository-details/sort-filter-bar";
import { useUserRepositories } from "@/components/repository-details/hooks/use-user-repositories";
import { useSortFilter } from "@/components/repository-details/hooks/use-sort-filter";

export default function RepositoryDetails() {
  const {
    userRepositories,
    isUserRepositoryFetching,
    isUserRepositoryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserRepositories();

  const {
    sort,
    setSort,
    languageFilter,
    setLanguageFilter,
    availableLanguages,
    filteredAndSorted,
  } = useSortFilter(userRepositories);

  const { colors } = useTheme();

  if (isUserRepositoryFetching && userRepositories.length === 0) {
    return <LoadingState />;
  }

  if (isUserRepositoryError) {
    return (
      <ErrorState message="Failed to load repositories. Check your connection or try again." />
    );
  }

  if (userRepositories.length === 0) {
    return null;
  }

  const owner = userRepositories[0].owner;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.profileHeader,
          { backgroundColor: colors.surface, borderBottomColor: colors.outline },
        ]}
      >
        <Image
          source={owner.avatar_url}
          style={styles.avatar}
          accessibilityLabel={`Avatar of ${owner.login}`}
        />
        <View style={styles.profileInfo}>
          <Text
            variant="titleLarge"
            style={{ color: colors.onSurface, fontWeight: "700" }}
          >
            {owner.login}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {userRepositories.length} repositories
          </Text>
        </View>
      </View>

      <SortFilterBar
        sort={sort}
        onSortChange={setSort}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
        availableLanguages={availableLanguages}
        totalCount={userRepositories.length}
        filteredCount={filteredAndSorted.length}
      />

      <RepositoriesList
        userRepositories={filteredAndSorted}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    gap: 2,
  },
});
