'use client';

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_REPOSITORIES } from './query'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import RepoCard from './components/RepoCard';
import RepoSearchBar from './components/RepoSearchBar';
import RepoPagination from './components/RepoPagination';
import { fetchCommitActivity } from '@/utils/fetchCommitActivity';


const Repositories = () => {

  const [commitData, setCommitData] = useState<{ [key: string]: number[] }>({});
  const { userId } = useParams() as { userId: string };
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);

  const { data: userRepositories, loading: userLoading, error: userError, fetchMore } = useQuery(GET_USER_REPOSITORIES, {
    variables: {
      userId: userId,
      first: 30,
      after: null,
      orderBy: "PUSHED_AT",
      direction: "DESC",
      ownerAffiliations: ["OWNER"]
    },
    fetchPolicy: 'cache-first',
  });

  const repos = userRepositories?.user?.repositories?.nodes ?? [];
  const pageInfo = userRepositories?.user?.repositories?.pageInfo;
  const totalCount = userRepositories?.user?.repositories?.totalCount ?? 0;

  type Repo = typeof repos[number];

  useEffect(() => {
    if (currentPage === 1) return;

    const targetCursorIndex = currentPage - 1;

    if (cursorHistory[targetCursorIndex] !== undefined) {
      fetchMore({
        variables: {
          after: cursorHistory[targetCursorIndex],
        },
        updateQuery: (_, { fetchMoreResult }) => {
          if (!fetchMoreResult) return _;
          return fetchMoreResult;
        },
      });
    }
  }, [currentPage]);

  useEffect(() => {
    const fetchNewCommitActivities = async () => {
      if (!repos.length) return;

      const reposToFetch = repos.filter((repo: Repo) => !commitData[repo.id]);
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
  }, [repos, userId]);

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

  const handleNextPage = async () => {
    if (!pageInfo?.hasNextPage) return;

    const nextPage = currentPage + 1;

    const newHistory = [...cursorHistory];
    if (nextPage - 1 >= newHistory.length) {
      newHistory.push(pageInfo.endCursor);
    }
    setCursorHistory(newHistory);

    await fetchMore({
      variables: {
        after: pageInfo.endCursor,
      },
      updateQuery: (_, { fetchMoreResult }) => {
        if (!fetchMoreResult) return _;
        return fetchMoreResult;
      },
    });

    updateUrl(nextPage);
    window.scrollTo({ top: 0 });
  };

  const handlePreviousPage = async () => {
    if (currentPage === 1) return;

    const prevPage = currentPage - 1;
    const prevCursor = cursorHistory[prevPage - 1];

    await fetchMore({
      variables: {
        after: prevCursor,
      },
      updateQuery: (_, { fetchMoreResult }) => {
        if (!fetchMoreResult) return _;
        return fetchMoreResult;
      },
    });

    updateUrl(prevPage);
    window.scrollTo({ top: 0 });
  };

  if (userLoading && repos.length === 0) return <Loading />;
  if (userError) return <p className='text-red-500'>Error: {userError.message}</p>;

  return (
    <>
      <RepoSearchBar />

      <ul className='text-custom_grey'>
        {repos.map((repo: Repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            sparklineData={commitData[repo.id] ?? new Array(52).fill(0)}
          />
        ))}
      </ul>

      <RepoPagination
        currentPage={currentPage}
        hasNextPage={pageInfo?.hasNextPage ?? false}
        isLoading={userLoading}
        totalCount={totalCount}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
    </>
  )
}

export default Repositories