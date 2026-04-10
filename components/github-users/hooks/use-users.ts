import { githubService } from "@/app/services/GithubService";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (username: string) => {
  const {
    data: githubUsers = [],
    isLoading: isGithubProfilesLoading,
    isError: isGithubProfilesError,
    error: githubProfilesError,
    refetch,
  } = useQuery({
    queryKey: ["users", username],
    queryFn: () => githubService.getUserProfile(username),
    enabled: !!username,
  });

  return {
    githubUsers,
    isGithubProfilesLoading,
    isGithubProfilesError,
    githubProfilesError,
    fetchUsers: refetch,
  };
};
