import { githubService } from "@/app/services/GithubService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

interface IRouteParams {
  username: string;
}

const PER_PAGE = 30;

export const useUserRepositories = () => {
  const { username } = useLocalSearchParams() as unknown as IRouteParams;

  const {
    data,
    isFetching: isUserRepositoryFetching,
    isError: isUserRepositoryError,
    error: userRepositoryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["repositories", username],
    queryFn: ({ pageParam }) =>
      githubService.getRepositoriesByUsername(username, pageParam, PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PER_PAGE ? allPages.length + 1 : undefined,
    enabled: !!username,
  });

  const userRepositories = data?.pages.flat() ?? [];

  return {
    userRepositories,
    isUserRepositoryFetching,
    isUserRepositoryError,
    userRepositoryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
