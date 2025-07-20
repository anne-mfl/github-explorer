import React from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_OVERVIEW } from './query'
import { useParams } from 'next/navigation';
// import { useGithubContext } from 'context/GithubContext';

const Overview = () => {

  const { userId } = useParams() as { userId: string };

  // const { setUserId, setUserData } = useGithubContext();

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_OVERVIEW, {
    variables: {
      userId: userId,
    },
  });

  // useEffect(() => {
  //   if (userData) {
  //     setUserId(userId);
  //     setUserData(userData);
  //   }
  // }, [userData, setUserId, setUserData, userId]);

  console.log(userData)

  return (
    <div>
      {userLoading && <p>Loading...</p>}
      {userError && <p>Error: {userError.message}</p>}
      {userData && (
        <div>
          <h2>{userData.user.name} ({userData.user.login})</h2>
          <p>{userData.user.bio}</p>
          <p>Followers: {userData.user.followers.totalCount}</p>
          <p>Following: {userData.user.following.totalCount}</p>
          <p>Repositories: {userData.user.repositories.totalCount}</p>
        </div>
      )}
    </div>
  )
}

export default Overview