"use client"

import { useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation';
import Tab from './components/Tab';
import Overview from './components/Overview';
import Repositories from './components/Repositories';
import { useGithubContext } from 'context/GithubContext';


const User = () => {

  // const { userId } = useParams() as { userId: string };
  const currentTab = useSearchParams().get("tab") || "overview";

  // const { setUserId, setUserData } = useGithubContext();

  return (
    <div>
      <Tab />
      {currentTab === "overview" && <Overview />}
      {currentTab === "repositories" && <Repositories />}
    </div>
  )
}

export default User