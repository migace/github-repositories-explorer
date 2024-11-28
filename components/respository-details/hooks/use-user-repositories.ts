import { GithubService } from "@/app/services/GithubService";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

interface IRouteParams {
  username: string;
}

export const useUserRepositories = () => {
  const { username } = useLocalSearchParams() as unknown as IRouteParams;
  const githubService = new GithubService();

  const { data: userRepositories = [], isFetching: isUserRepositoryFetching } =
    useQuery({
      queryKey: ["respositories", username],
      queryFn: () => githubService.getRepositoriesByUsername(username),
      enabled: !!username,
    });

  return {
    userRepositories,
    isUserRepositoryFetching,
  };
};
