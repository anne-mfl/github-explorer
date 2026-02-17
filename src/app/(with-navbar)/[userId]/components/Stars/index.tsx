'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_STARRED_REPOSITORIES } from './query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import RepoCard from '@/components/RepoShared/RepoCard';
import RepoSearchBar, { STARS_SORT_OPTIONS } from '@/components/RepoShared/RepoSearchBar';
import RepoPagination from '@/components/RepoShared/RepoPagination';
import { fetchCommitActivity } from '@/utils/fetchCommitActivity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import StarButton from '@/components/RepoShared/StarButton';

const REPOS_PER_PAGE = 30;

const Stars = () => {
  const [commitData, setCommitData] = useState<{ [key: string]: number[] }>({});
  const { userId } = useParams() as { userId: string };
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recently-starred');

  const { data, loading, error } = useQuery(GET_USER_STARRED_REPOSITORIES, {
    variables: {
      userId,
      first: 100,
      after: null,
      // STARRED_AT maps to recently-starred; switch to UPDATED_AT otherwise
      orderBy: selectedSort === 'recently-starred' ? 'STARRED_AT' : 'UPDATED_AT',
      direction: 'DESC',
    },
    fetchPolicy: 'cache-first',
  });

  const allRepos = data?.user?.starredRepositories?.nodes ?? [];

  type Repo = typeof allRepos[number];

  const filteredRepos = useMemo(() => {
    let result = [...allRepos];

    if (searchTerm) {
      result = result.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    if (selectedLanguage !== 'all') {
      result = result.filter(repo => repo.primaryLanguage?.name === selectedLanguage);
    }

    // Client-side sort for name only (starred_at and updated_at come pre-sorted from API)
    if (selectedSort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allRepos, searchTerm, selectedLanguage, selectedSort]);

  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
    return filteredRepos.slice(startIndex, startIndex + REPOS_PER_PAGE);
  }, [filteredRepos, currentPage]);

  const totalPages = Math.ceil(filteredRepos.length / REPOS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;

  const updateUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'stars');
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    router.push(`/${userId}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (currentPage !== 1) updateUrl(1);
  }, [searchTerm, selectedLanguage, selectedSort]);

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
            // For starred repos, owner login is on repo.owner.login
            const data = await fetchCommitActivity(repo.owner.login, repo.name);
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
  }, [paginatedRepos]);

  const isFiltered = selectedLanguage !== 'all' || searchTerm !== '';

  if (loading && allRepos.length === 0) return <Loading />;
  if (error) return <p className='text-red-500'>Error: {error.message}</p>;

  return (
    <>
      <RepoSearchBar
        repos={allRepos}
        searchTerm={searchTerm}
        selectedType='all'
        selectedLanguage={selectedLanguage}
        selectedSort={selectedSort}
        onSearchChange={setSearchTerm}
        onTypeChange={() => { }}
        onLanguageChange={setSelectedLanguage}
        onSortChange={setSelectedSort}
        showTypeFilter={false}
        placeholder='Find a starred repository...'
        sortOptions={STARS_SORT_OPTIONS}
      />

      {isFiltered && (
        <div className='border-b border-custom_light_grey py-4 flex justify-between items-center'>
          <p>
            <b>{filteredRepos.length}</b> starred repositories matching&nbsp;
            {searchTerm && <b>{searchTerm}&nbsp;</b>}
            {selectedLanguage !== 'all' && (
              <span>written in <b>{selectedLanguage}&nbsp;</b></span>
            )}
          </p>
          <button
            className='text-custom_grey hover:text-custom_blue cursor-pointer ml-4'
            onClick={() => {
              setSearchTerm('');
              setSelectedLanguage('all');
              setSelectedSort('recently-starred');
            }}
          >
            <FontAwesomeIcon icon={faRectangleXmark} className='w-4' /> Clear filter
          </button>
        </div>
      )}

      <ul className='text-custom_grey'>
        {paginatedRepos.length > 0 ? (
          paginatedRepos.map((repo: Repo) => (
            // <RepoCard
            //   key={repo.id}
            //   repo={repo}
            //   showSponsor={true}
            // />

            // <RepoCard
            //   key={repo.id}
            //   repo={repo}
            //   sparklineData={commitData[repo.id] ?? new Array(52).fill(0)}
            // />

            <RepoCard
              key={repo.id}
              repo={repo}
              actions={<StarButton showSponsor={repo.fundingLinks.length > 0} />}
              showLicense={false}
            />
          ))
        ) : (
          <li className='py-8 text-center p-8 mt-8 font-semibold text-custom_black text-xl'>
            {filteredRepos.length === 0
              ? `${userId} doesn't have any starred repositories that match.`
              : 'Loading...'}
          </li>
        )}
      </ul>

      <RepoPagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        isLoading={loading}
        totalCount={filteredRepos.length}
        onPrevious={() => {
          if (currentPage === 1) return;
          updateUrl(currentPage - 1);
          window.scrollTo({ top: 0 });
        }}
        onNext={() => {
          if (!hasNextPage) return;
          updateUrl(currentPage + 1);
          window.scrollTo({ top: 0 });
        }}
      />
    </>
  );
};

export default Stars;