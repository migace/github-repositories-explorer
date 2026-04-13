import { useMemo, useState } from "react";
import type { GithubRepositoryDto } from "@/types/dto";

export type SortOption =
  | "stars_desc"
  | "stars_asc"
  | "name_asc"
  | "name_desc"
  | "updated_desc";

type Repo = Pick<
  GithubRepositoryDto,
  "id" | "name" | "description" | "stargazers_count" | "language" | "updated_at"
> & {
  owner: Pick<GithubRepositoryDto["owner"], "login" | "avatar_url">;
};

export const SORT_LABELS: Record<SortOption, string> = {
  stars_desc: "⭐ Most stars",
  stars_asc: "⭐ Fewest stars",
  name_asc: "A → Z",
  name_desc: "Z → A",
  updated_desc: "🕒 Recently updated",
};

const sortRepos = (repos: Repo[], sort: SortOption): Repo[] => {
  const copy = [...repos];
  switch (sort) {
    case "stars_desc":
      return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case "stars_asc":
      return copy.sort((a, b) => a.stargazers_count - b.stargazers_count);
    case "name_asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "updated_desc":
      return copy.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
  }
};

export const useSortFilter = (repos: Repo[]) => {
  const [sort, setSort] = useState<SortOption>("stars_desc");
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  const availableLanguages = useMemo(
    () =>
      Array.from(
        new Set(repos.map((r) => r.language).filter((lang): lang is string => Boolean(lang))),
      ).sort((a, b) => a.localeCompare(b)),
    [repos],
  );

  const filteredAndSorted = useMemo(() => {
    const filtered = languageFilter
      ? repos.filter((r) => r.language === languageFilter)
      : repos;
    return sortRepos(filtered, sort);
  }, [repos, sort, languageFilter]);

  return {
    sort,
    setSort,
    languageFilter,
    setLanguageFilter,
    availableLanguages,
    filteredAndSorted,
  };
};
