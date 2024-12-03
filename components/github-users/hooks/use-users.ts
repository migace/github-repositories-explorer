import { GithubService } from "@/app/services/GithubService";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (username: string) => {
  const githubService = new GithubService();
  const {
    data: githubUsers = [],
    isLoading: isGithubProfilesLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => githubService.getUserProfile(username),
    enabled: !!username,
  });

  return {
    githubUsers,
    isGithubProfilesLoading,
    fetchUsers: refetch,
  };
};
