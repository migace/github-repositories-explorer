import { githubService } from "@/app/services/GithubService";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

interface IRouteParams {
  username: string;
}

export const useUserRepositories = () => {
  const { username } = useLocalSearchParams() as unknown as IRouteParams;

  const {
    data: userRepositories = [],
    isFetching: isUserRepositoryFetching,
    isError: isUserRepositoryError,
    error: userRepositoryError,
  } = useQuery({
    queryKey: ["repositories", username],
    queryFn: () => githubService.getRepositoriesByUsername(username),
    enabled: !!username,
  });

  return {
    userRepositories,
    isUserRepositoryFetching,
    isUserRepositoryError,
    userRepositoryError,
  };
};
