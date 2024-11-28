import { GithubService } from "@/app/services/GithubService";
import { IGithubUserDto } from "@/app/types/dto";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useUsers = () => {
  const [githubUsers, setGithubUsers] = useState<IGithubUserDto[]>([]);
  const [isGithubProfilesLoading, setIsGithubProfilesLoading] = useState(false);
  const githubService = new GithubService();
  const queryClient = new QueryClient();

  const fetchUsers = async (username: string) => {
    try {
      setIsGithubProfilesLoading(true);
      const data = await queryClient.fetchQuery({
        queryKey: ["users"],
        queryFn: () => githubService.getUserProfile(username),
      });

      setGithubUsers(data);
      setIsGithubProfilesLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    githubUsers,
    isGithubProfilesLoading,
    fetchUsers,
  };
};
