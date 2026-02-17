'use client';

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_REPOSITORIES } from './query'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import RepoCard from '@/components/RepoShared/RepoCard';
import RepoSearchBar from '@/components/RepoShared/RepoSearchBar';
import RepoTopics from './components/RepoTopics';
import RepoSparkline from './components/RepoSparkline';
import RepoPagination from '@/components/RepoShared/RepoPagination';
import { fetchCommitActivity } from '@/utils/fetchCommitActivity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';

const REPOS_PER_PAGE = 30;

const Repositories = () => {
  const [commitData, setCommitData] = useState<{ [key: string]: number[] }>({});
  const { userId } = useParams() as { userId: string };
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSort, setSelectedSort] = useState('last-updated');

  // Fetch ALL repositories at once
  const { data: userRepositories, loading: userLoading, error: userError } = useQuery(GET_USER_REPOSITORIES, {
    variables: {
      userId: userId,
      first: 100, // Adjust based on expected repo count
      after: null,
      orderBy: "UPDATED_AT",
      direction: "DESC",
      ownerAffiliations: ["OWNER"]
    },
    fetchPolicy: 'cache-first',
  });

  const allRepos = userRepositories?.user?.repositories?.nodes ?? [];
  const totalCount = userRepositories?.user?.repositories?.totalCount ?? 0;

  type Repo = typeof allRepos[number];

  // Apply filters and sort to ALL repos
  const filteredRepos = useMemo(() => {
    let result = [...allRepos];

    // Search filter
    if (searchTerm) {
      result = result.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Type filter
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
        case 'mirrors':
          break;
      }
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      result = result.filter(repo => repo.primaryLanguage?.name === selectedLanguage);
    }

    // Sort
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

  // Client-side pagination on filtered results
  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
    return filteredRepos.slice(startIndex, startIndex + REPOS_PER_PAGE);
  }, [filteredRepos, currentPage]);

  const totalPages = Math.ceil(filteredRepos.length / REPOS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      updateUrl(1);
    }
  }, [searchTerm, selectedType, selectedLanguage, selectedSort]);

  // Fetch commit activity for current page repos
  useEffect(() => {
    const fetchNewCommitActivities = async () => {
      if (!paginatedRepos.length) return;

      const reposToFetch = paginatedRepos.filter((repo: Repo) => !commitData[repo.id]);
      if (reposToFetch.length === 0) return;

      const CONCURRENCY_LIMIT = 5;

      for (let i = 0; i < reposToFetch.length; i += CONCURRENCY_LIMIT) {
        const batch = reposToFetch.slice(i, i + CONCURRENCY_LIMIT);
        const results = await Promise.all(
          batch.map(async (repo: Repo) => {
            const data = await fetchCommitActivity(userId, repo.name);
            return { id: repo.id, data };
          })
        );

        setCommitData(prev => ({
          ...prev,
          ...Object.fromEntries(
            results
              .filter(({ data }) => data !== null)
              .map(({ id, data }) => [id, data])
          ),
        }));
      }
    };

    fetchNewCommitActivities();
  }, [paginatedRepos, userId]);

  const updateUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'repositories');

    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }

    router.push(`/${userId}?${params.toString()}`, { scroll: false });
  };

  const handleNextPage = () => {
    if (!hasNextPage) return;
    updateUrl(currentPage + 1);
    window.scrollTo({ top: 0 });
  };

  const handlePreviousPage = () => {
    if (currentPage === 1) return;
    updateUrl(currentPage - 1);
    window.scrollTo({ top: 0 });
  };

  if (userLoading && allRepos.length === 0) return <Loading />;
  if (userError) return <p className='text-red-500'>Error: {userError.message}</p>;

  return (
    <>
      <RepoSearchBar
        repos={allRepos}
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedLanguage={selectedLanguage}
        selectedSort={selectedSort}
        onSearchChange={setSearchTerm}
        onTypeChange={setSelectedType}
        onLanguageChange={setSelectedLanguage}
        onSortChange={setSelectedSort}
      />

      {(selectedType !== 'all' || selectedLanguage !== 'all' || searchTerm !== '') && (
        <div className='border-b border-custom_light_grey py-4 flex justify-between items-center'>
          <p>
            <b>{filteredRepos.length}</b> results for&nbsp;
            {selectedType !== 'all' && (
              <b>{
                selectedType === 'sources' ? 'source'
                  : selectedType === 'forks' ? 'forked'
                    : selectedType === 'can be sponsored' ? 'sponsorable'
                      : selectedType === 'mirrors' ? 'mirror'
                        : selectedType === 'templates' ? 'template'
                          : selectedType
              }&nbsp;
              </b>
            )}
            repositories matching&nbsp;
            {searchTerm !== '' && (
              <b>{searchTerm}&nbsp;</b>
            )}
            {selectedLanguage !== 'all' && (
              <span>written in <b>{selectedLanguage}&nbsp;</b></span>
            )}
            sorted by&nbsp;
            {selectedSort && (
              <b>{selectedSort === 'last-updated' ? 'last updated' : selectedSort}</b>
            )}
          </p>
          <button
            className='text-custom_grey hover:text-custom_blue cursor-pointer ml-4'
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedLanguage('all');
              setSelectedSort('last-updated');
            }}
          >
            <FontAwesomeIcon icon={faRectangleXmark} className=' w-4' /> Clear filter
          </button>
        </div>
      )}

      <ul className='text-custom_grey'>
        {paginatedRepos.length > 0 ? (
          paginatedRepos.map((repo: Repo) => (
            // <RepoCard
            //   key={repo.id}
            //   repo={repo}
            //   sparklineData={commitData[repo.id] ?? new Array(52).fill(0)}
            // />

            // <div key={repo.id} className='relative'>
            //   <RepoCard
            //     repo={repo}
            //     topics={<RepoTopics topics={repo.repositoryTopics.nodes} />}
            //   />
            //   <div className='absolute right-0 top-1/2 -translate-y-1/2'>
            //     <RepoSparkline data={commitData[repo.id] ?? new Array(52).fill(0)} />
            //   </div>
            // </div>

            <RepoCard
              key={repo.id}
              repo={repo}
              topics={<RepoTopics topics={repo.repositoryTopics.nodes} />}
              actions={<RepoSparkline data={commitData[repo.id] ?? new Array(52).fill(0)} />}
            />
          ))
        ) : (
          <li className='py-8 text-center p-8 mt-8 font-semibold text-custom_black text-xl'>
            {filteredRepos.length === 0
              ? `${userId} doesn't have any repositories that match.`
              : 'Loading...'}
          </li>
        )}
      </ul>

      <RepoPagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        isLoading={userLoading}
        totalCount={filteredRepos.length}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
    </>
  )
}

export default Repositories