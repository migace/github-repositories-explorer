import { githubService } from "@/app/services/GithubService";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";

const SEARCH_DEBOUNCE_MS = 350;

export const useUsers = (username: string) => {
  const debouncedUsername = useDebounce(username, SEARCH_DEBOUNCE_MS);

  const {
    data: githubUsers = [],
    isLoading: isGithubProfilesLoading,
    isError: isGithubProfilesError,
  } = useQuery({
    queryKey: ["users", debouncedUsername],
    queryFn: () => githubService.getUserProfile(debouncedUsername),
    enabled: !!debouncedUsername,
  });

  return {
    githubUsers,
    isGithubProfilesLoading,
    isGithubProfilesError,
  };
};
