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

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.backdrop }]}>
      {userRepositories.length > 0 && (
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <Image
              source={userRepositories[0].owner.avatar_url}
              style={styles.headerImage}
              accessibilityLabel={`Avatar of ${userRepositories[0].owner.login}`}
            />
            <Text
              style={[styles.headerText, { color: colors.onBackground }]}
              accessibilityRole="header"
            >
              {userRepositories[0].owner.login}
            </Text>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    flex: 1,
  },
  headerWrapper: {
    flex: 1,
  },
  headerImage: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  headerContent: {
    alignItems: "flex-start",
    padding: 20,
    flexDirection: "row",
  },
  headerText: {
    fontSize: 32,
  },
});
