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
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recently-starred');

  const { data, loading, error } = useQuery(GET_USER_STARRED_REPOSITORIES, {
    variables: {
      userId,
      first: 100,
      after: null,
      orderBy: 'STARRED_AT',
      direction: 'DESC',
    },
    fetchPolicy: 'cache-first',
  });

  const allRepos = data?.user?.starredRepositories?.nodes ?? [];

  type Repo = typeof allRepos[number];

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
      // 'recently-starred' comes pre-sorted from the API as STARRED_AT DESC, no action needed
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

  const isFiltered = selectedLanguage !== 'all' || searchTerm !== '' || selectedType !== 'all';

  if (loading && allRepos.length === 0) return <Loading />;
  if (error) return <p className='text-red-500'>Error: {error.message}</p>;

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
        placeholder='Find a starred repository...'
        sortOptions={STARS_SORT_OPTIONS}
      />

      {/* {isFiltered && (
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
              setSelectedType('all');
              setSelectedLanguage('all');
              setSelectedSort('recently-starred');
            }}
          >
            <FontAwesomeIcon icon={faRectangleXmark} className='w-4' /> Clear filter
          </button>
        </div>
      )} */}
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
            starred repositories&nbsp;
            {searchTerm !== '' && (
              <span>matching&nbsp;<b>{searchTerm}&nbsp;</b></span>
            )}
            {selectedLanguage !== 'all' && (
              <span>written in <b>{selectedLanguage}&nbsp;</b></span>
            )}
            sorted by&nbsp;
            {selectedSort && (
              <b>{selectedSort === 'last-updated' ? 'Recently active' : selectedSort === 'recently-starred' ? 'Recently starred' : selectedSort === 'stars' ? 'Most stars' : selectedSort}</b>
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