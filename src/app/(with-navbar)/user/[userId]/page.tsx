"use client"

import { useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USER } from './query';
import { useParams, useSearchParams } from 'next/navigation';
import Tab from './components/Tab';
import Overview from './components/Overview';
import Repositories from './components/Repositories';


const User = () => {

  const { userId } = useParams();
  const currentTab = useSearchParams().get("tab") || "overview";

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    variables: {
      userId: userId,
    },
  });
  console.log('User Data:', userData);


  return (
    <div>
      <Tab />
      <div>User Profile: {userId}</div>
      {currentTab === "overview" && <Overview />}
      {currentTab === "repositories" && <Repositories />}
    </div>
  )
}

export default User