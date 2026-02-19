import { useQuery } from '@apollo/client';
import { GET_USER_STARRED_REPOSITORIES } from './query';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import RepoCard from '@/components/RepoShared/RepoCard';
import RepoSearchBar, { STARS_SORT_OPTIONS } from '@/components/RepoShared/RepoSearchBar';
import RepoPagination from '@/components/RepoShared/RepoPagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import StarButton from '@/components/RepoShared/StarButton';
import { useRepoList } from '../../hooks/useRepoList';

const Stars = () => {
  const { userId } = useParams() as { userId: string };

  const { data, loading, error } = useQuery(GET_USER_STARRED_REPOSITORIES, {
    variables: { userId, first: 100, after: null, direction: 'DESC' },
    fetchPolicy: 'cache-first',
  });

  const allRepos = data?.user?.starredRepositories?.nodes ?? [];

  const {
    searchTerm, setSearchTerm,
    selectedType, setSelectedType,
    selectedLanguage, setSelectedLanguage,
    selectedSort, setSelectedSort,
    filteredRepos, paginatedRepos, commitData,
    currentPage, hasNextPage,
    handlePreviousPage, handleNextPage,
    isFiltered, clearFilters,
  } = useRepoList({
    allRepos,
    tab: 'stars',
    defaultSort: 'recently-starred',
    getOwner: (repo) => repo.owner?.login ?? userId,
  });

  type Repo = typeof allRepos[number];

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

      {isFiltered && (
        <div className='border-b border-custom_light_grey py-4 flex justify-between items-center'>
          <p>
            <b>{filteredRepos.length}</b> results for&nbsp;
            {selectedType !== 'all' && <b>{selectedType === 'forks' ? 'forked' : selectedType}&nbsp;</b>}
            starred repositories&nbsp;
            {searchTerm && <span>matching <b>{searchTerm}&nbsp;</b></span>}
            {selectedLanguage !== 'all' && <span>written in <b>{selectedLanguage}&nbsp;</b></span>}
            sorted by <b>{selectedSort === 'last-updated' ? 'Recently active' : selectedSort === 'recently-starred' ? 'Recently starred' : 'Most stars'}</b>
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
              actions={<StarButton sponsor={repo.fundingLinks} />}
              // actions={<StarButton showSponsor={repo.fundingLinks.length > 0} />}
              showLicense={false}
              showPublicOrPrivate={false}
            />
          ))
        ) : (
          <li className='py-8 text-center p-8 mt-8 font-semibold text-custom_black text-xl'>
            {userId} doesn't have any starred repositories that match.
          </li>
        )}
      </ul>

      <RepoPagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        isLoading={loading}
        totalCount={filteredRepos.length}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
    </>
  );
};
export default Stars;