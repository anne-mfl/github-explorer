import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { fetchCommitActivity } from '@/utils/fetchCommitActivity';

interface Repo {
  id: string;
  name: string;
  description?: string | null;
  isFork?: boolean;
  isArchived?: boolean;
  pushedAt?: string | null;
  stargazerCount: number;
  primaryLanguage?: { name: string; color: string | null } | null;
  owner?: { login: string };
}

interface UseRepoListOptions {
  allRepos: Repo[];
  tab: 'repositories' | 'stars';
  defaultSort: string;
  getOwner?: (repo: Repo) => string; // how to resolve the owner for commit activity
}

const REPOS_PER_PAGE = 30;

export const useRepoList = ({ allRepos, tab, defaultSort, getOwner }: UseRepoListOptions) => {
  const [commitData, setCommitData] = useState<{ [key: string]: number[] }>({});
  const { userId } = useParams() as { userId: string };
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSort, setSelectedSort] = useState(defaultSort);

  const filteredRepos = useMemo(() => {
    let result = [...allRepos];

    if (searchTerm) {
      result = result.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    if (selectedType !== 'all') {
      switch (selectedType) {
        case 'sources':
          result = result.filter(repo => !repo.isFork && !repo.isArchived);
          break;
        case 'forks':
          result = result.filter(repo => repo.isFork);
          break;
        case 'archived':
          result = result.filter(repo => repo.isArchived);
          break;
      }
    }

    if (selectedLanguage !== 'all') {
      result = result.filter(repo => repo.primaryLanguage?.name === selectedLanguage);
    }

    switch (selectedSort) {
      case 'last-updated':
        result.sort((a, b) => new Date(b.pushedAt ?? 0).getTime() - new Date(a.pushedAt ?? 0).getTime());
        break;
      case 'stars':
        result.sort((a, b) => b.stargazerCount - a.stargazerCount);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [allRepos, searchTerm, selectedType, selectedLanguage, selectedSort]);

  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
    return filteredRepos.slice(startIndex, startIndex + REPOS_PER_PAGE);
  }, [filteredRepos, currentPage]);

  const totalPages = Math.ceil(filteredRepos.length / REPOS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;

  const updateUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    router.push(`/${userId}?${params.toString()}`, { scroll: false });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) updateUrl(1);
  }, [searchTerm, selectedType, selectedLanguage, selectedSort]);

  // Fetch commit activity for visible repos
  useEffect(() => {
    const fetchNewCommitActivities = async () => {
      if (!paginatedRepos.length) return;

      const reposToFetch = paginatedRepos.filter(repo => !commitData[repo.id]);
      if (reposToFetch.length === 0) return;

      const CONCURRENCY_LIMIT = 5;

      for (let i = 0; i < reposToFetch.length; i += CONCURRENCY_LIMIT) {
        const batch = reposToFetch.slice(i, i + CONCURRENCY_LIMIT);
        const results = await Promise.all(
          batch.map(async repo => {
            const owner = getOwner ? getOwner(repo) : userId;
            const data = await fetchCommitActivity(owner, repo.name);
            return { id: repo.id, data };
          })
        );

        setCommitData(prev => ({
          ...prev,
          ...Object.fromEntries(
            results
              .filter((result): result is { id: string; data: number[] } => result.data !== null)
              .map(({ id, data }) => [id, data])
          ),
        }));
      }
    };

    fetchNewCommitActivities();
  }, [paginatedRepos, userId]);

  const handlePreviousPage = () => {
    if (currentPage === 1) return;
    updateUrl(currentPage - 1);
    window.scrollTo({ top: 0 });
  };

  const handleNextPage = () => {
    if (!hasNextPage) return;
    updateUrl(currentPage + 1);
    window.scrollTo({ top: 0 });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedLanguage('all');
    setSelectedSort(defaultSort);
  };

  const isFiltered = searchTerm !== '' || selectedType !== 'all' || selectedLanguage !== 'all';

  return {
    // filter state
    searchTerm, setSearchTerm,
    selectedType, setSelectedType,
    selectedLanguage, setSelectedLanguage,
    selectedSort, setSelectedSort,
    // derived data
    filteredRepos,
    paginatedRepos,
    commitData,
    // pagination
    currentPage,
    hasNextPage,
    handlePreviousPage,
    handleNextPage,
    // helpers
    isFiltered,
    clearFilters,
  };
};