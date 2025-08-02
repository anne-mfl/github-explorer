import { useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_OVERVIEW } from './query'
import { useParams } from 'next/navigation';
import { useGithubContext } from 'context/GithubContext';
import LeftBar from './components/LeftBar';
import Repositories from './components/Repositories';
import Contributions from './components/Contributions';

const Overview = () => {

  const { userId } = useParams() as { userId: string };

  const { setUserId, setUserData } = useGithubContext();

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_OVERVIEW, {
    variables: {
      userId: userId,
    },
  });

  useEffect(() => {
    if (userData) {
      setUserId(userId);
      setUserData(userData);
    }
  }, [userData, setUserId, setUserData, userId]);

  console.log(userData?.user)

  return (
    <div>
      {userLoading && <p>Loading...</p>}
      {userError && <p>Error: {userError.message}</p>}

      {userData && (
        <main className='flex gap-6 mx-20 my-2'>
          <LeftBar />
          <div className='grow bg-amber-50'>
            <Repositories />
            <Contributions />
          </div>
        </main>
      )}
    </div>
  )
}

export default Overview