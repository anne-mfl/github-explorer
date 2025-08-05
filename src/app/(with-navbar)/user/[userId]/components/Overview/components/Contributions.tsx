import React from 'react'
import { useGithubContext } from 'context/GithubContext';


const Contributions = () => {

  const { userData } = useGithubContext();

  const contributions = userData?.user?.contributionsCollection || null;

  return (
    <div className=''>
      {contributions?.contributionCalendar.totalContributions > 0
        ? <p>{contributions?.contributionCalendar.totalContributions} contributions in the last year</p>
        : <></>
      }
    </div>
  )
}

export default Contributions