'use client';

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_REPOSITORIES } from './query'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import RepoCard from '@/components/RepoShared/RepoCard';
import RepoSearchBar, { REPO_SORT_OPTIONS } from '@/components/RepoShared/RepoSearchBar';
import RepoTopics from './components/RepoTopics';
import RepoSparkline from './components/RepoSparkline';
import RepoPagination from '@/components/RepoShared/RepoPagination';
import { fetchCommitActivity } from '@/utils/fetchCommitActivity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { useRepoList } from '../../hooks/useRepoList';

const Repositories = () => {
  const { userId } = useParams() as { userId: string };

  const { data: userRepositories, loading: userLoading, error: userError } = useQuery(GET_USER_REPOSITORIES, {
    variables: { userId, first: 100, after: null, orderBy: "UPDATED_AT", direction: "DESC", ownerAffiliations: ["OWNER"] },
    fetchPolicy: 'cache-first',
  });

  const allRepos = userRepositories?.user?.repositories?.nodes ?? [];

  const {
    searchTerm, setSearchTerm,
    selectedType, setSelectedType,
    selectedLanguage, setSelectedLanguage,
    selectedSort, setSelectedSort,
    filteredRepos, paginatedRepos, commitData,
    currentPage, hasNextPage,
    handlePreviousPage, handleNextPage,
    isFiltered, clearFilters,
  } = useRepoList({ allRepos, tab: 'repositories', defaultSort: 'last-updated' });

  type Repo = typeof allRepos[number];

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
        sortOptions={REPO_SORT_OPTIONS}
      />

      {isFiltered && (
        <div className='border-b border-custom_light_grey py-4 flex justify-between items-center'>
          <p>
            <b>{filteredRepos.length}</b> results for&nbsp;
            {selectedType !== 'all' && <b>{selectedType === 'sources' ? 'source' : selectedType === 'forks' ? 'forked' : selectedType}&nbsp;</b>}
            repositories&nbsp;
            {searchTerm && <span>matching <b>{searchTerm}&nbsp;</b></span>}
            {selectedLanguage !== 'all' && <span>written in <b>{selectedLanguage}&nbsp;</b></span>}
            sorted by <b>{selectedSort === 'last-updated' ? 'last updated' : selectedSort}</b>
          </p>
          <button className='text-custom_grey hover:text-custom_blue cursor-pointer ml-4' onClick={clearFilters}>
            <FontAwesomeIcon icon={faRectangleXmark} className='w-4' /> Clear filter
          </button>
        </div>
      )}

      <ul className='text-custom_grey'>
        {paginatedRepos.length > 0 ? (
          paginatedRepos.map((repo: Repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              topics={<RepoTopics topics={repo.repositoryTopics.nodes} />}
              actions={<RepoSparkline data={commitData[repo.id] ?? new Array(52).fill(0)} />}
            />
          ))
        ) : (
          <li className='py-8 text-center p-8 mt-8 font-semibold text-custom_black text-xl'>
            {userId} doesn't have any repositories that match.
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
  );
};

export default Repositories