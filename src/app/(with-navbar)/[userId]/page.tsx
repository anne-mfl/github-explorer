"use client"

import { useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_USER_OVERVIEW } from './query';
import { useGithubContext } from 'context/GithubContext';
import Tab from './components/Tab';
import Overview from './components/Overview';
import Stars from './components/Stars';
import Repositories from './components/Repositories';
import ProfileSideBar from '@/components/ProfileSideBar';
import Loading from '@/components/Loading';

const User = () => {
  const { userId } = useParams() as { userId: string };
  const currentTab = useSearchParams().get("tab") || "overview";
  const { setUserId, setUserData } = useGithubContext();

  // Fetch user data once at this level
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_OVERVIEW, {
    variables: {
      userId: userId,
    },
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (userData) {
      setUserId(userId);
      setUserData(userData);
    }
  }, [userData, setUserId, setUserData, userId]);

  // Show loading only for sidebar area
  if (userLoading && !userData) {
    return (
      <div>
        <Tab />
        <main className='flex gap-6 mx-32 my-8'>
          <div className='w-74'>
            <Loading />
          </div>
          <div className='flex-1 min-w-0'>
            {/* Content will load after */}
          </div>
        </main>
      </div>
    );
  }

  if (userError) {
    return (
      <div>
        <Tab />
        <main className='flex gap-6 mx-32 my-8'>
          <div className='w-74'>
            <p className='text-red-500'>Error loading profile: {userError.message}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Tab />
      <main className='flex max-md:flex-col gap-6 my-8 max-w-[1280px] mx-auto px-8 max-lg:px-6 max-md:px-4 max-md:gap-0'>
        <div className='w-74 max-lg:w-64 max-md:w-full'>
          <ProfileSideBar />
        </div>
        <div className='flex-1 min-w-0'>
          {currentTab === 'overview' && <Overview />}
          {currentTab === 'repositories' && <Repositories />}
          {currentTab === 'stars' && <Stars />}
        </div>
      </main>
    </div>
  )
}

export default User