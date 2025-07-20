import React from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_REPOSITORIES } from './query'
import { useParams } from 'next/navigation';

const Repositories = () => {

  const { userId } = useParams() as { userId: string };
  console.log("User ID:", userId);

  // Default: show user's own repositories, sorted by last updated
  const variables = {
    userId: userId,
    first: 20,
    orderBy: "UPDATED_AT",
    direction: "DESC",
    ownerAffiliations: ["OWNER"]
  };

  // Show only forks
  const forkVariables = {
    userId: userId,
    isFork: true,
    ownerAffiliations: ["OWNER"]
  };

  // Show only JavaScript repositories
  const jsVariables = {
    userId: userId,
    language: "JavaScript"
  };

  // Show archived repositories
  const archivedVariables = {
    userId: userId,
    isArchived: true
  };

  // Pagination
  // const nextPageVariables = {
  //   ...variables,
  //   after: pageInfo.endCursor
  // };


  const { data: userRepositories, loading: userLoading, error: userError } = useQuery(GET_USER_REPOSITORIES, {
    variables: {
    userId: userId,
    first: 20,
    orderBy: "UPDATED_AT",
    direction: "DESC",
    ownerAffiliations: ["OWNER"]
  }
  });

  return (
    <div>
      {userLoading && <p>Loading...</p>}
      {userError && <p>Error: {userError.message}</p>}
      {userRepositories && (
        <div>
          <h2>Repositories for {userRepositories.user.name}</h2>
          <ul>
            {userRepositories.user.repositories.nodes.map((repo: any) => (
              <li key={repo.id}>
                <a href={repo.url}>{repo.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Repositories