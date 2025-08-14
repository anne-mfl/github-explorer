import { useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_OVERVIEW } from './query'
import { useParams } from 'next/navigation';
import { useGithubContext } from 'context/GithubContext';
import ProfileSideBar from './components/ProfileSideBar';
import Repositories from './components/Repositories';
// import Contributions from './components/Contributions/components/Heatmap';
import Contributions from './components/Contributions'

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

  // console.log(userData?.user)

  return (
    <div>
      {userLoading && <p>Loading...</p>}
      {userError && <p>Error: {userError.message}</p>}

      {userData && (
        <main className='flex gap-6 mx-32 my-8'>
          {/* <ProfileSideBar /> */}
          <div className='grow'>
            <Repositories />
            <div className='h-8'></div>
            <Contributions />
          </div>
        </main>
      )}
    </div>
  )
}

export default Overview