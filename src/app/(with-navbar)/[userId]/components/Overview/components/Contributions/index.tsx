'use client'

import { useEffect, useState } from 'react'
import Heatmap from './components/ContributionHeatmap'
import YearSelectionBar from './components/YearSelectionBar'
import Radar from './components/ContributionRadar'
import { useGithubContext } from 'context/GithubContext';
import { useParams } from 'next/navigation'
import { useLazyQuery } from '@apollo/client'
import { GET_CONTRIBUTION_FOR_SPECIFIC_YEAR } from '../../query'
import ActivityOverview from './components/ActivityOverview';


const ContributionsIndex = () => {

  const {
    userData,
    selectedYear,
    contributions,
    setContributions,
    isLoadingContributions,
    setIsLoadingContributions,
    contributionsError,
    setContributionsError,
    isLastYearView,
    setIsLastYearView,
  } = useGithubContext();
  const { userId } = useParams() as { userId: string }
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [fetchYearContributions, { data: userQueryData, loading, error }] = useLazyQuery(GET_CONTRIBUTION_FOR_SPECIFIC_YEAR)

  // const contributionCalendar = contributions?.contributionCalendar
  const totalContributionsNumber = contributions?.contributionCalendar?.totalContributions.toLocaleString()

  useEffect(() => {
    setIsLoadingContributions(loading);
    setContributionsError(error);
  }, [loading, error, setIsLoadingContributions, setContributionsError])

  // useEffect(() => {
  //   const to = new Date(`${selectedYear}-12-31T23:59:59Z`);
  //   const from = new Date(`${selectedYear}-01-01T00:00:00Z`);
  //   fetchYearContributions({
  //     variables: {
  //       userId: userId,
  //       from: from.toISOString(),
  //       to: to.toISOString(),
  //     },
  //   })
  // }, [selectedYear, userId, fetchYearContributions])

  useEffect(() => {
    let from: Date;
    let to: Date;

    if (isLastYearView) {
      // Show contributions from last 365 days
      to = new Date();
      from = new Date();
      from.setDate(from.getDate() - 365);
    } else {
      // Show contributions for the selected calendar year
      to = new Date(`${selectedYear}-12-31T23:59:59Z`);
      from = new Date(`${selectedYear}-01-01T00:00:00Z`);
    }

    fetchYearContributions({
      variables: {
        userId: userId,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    })
  }, [selectedYear, userId, fetchYearContributions, isLastYearView])


  useEffect(() => {
    if (userQueryData?.user?.contributionsCollection?.contributionCalendar && !loading && !error) {
      setContributions(userQueryData.user.contributionsCollection)
      setHasLoadedOnce(true)
    }
  }, [userQueryData, loading, error])


  // if (isLoadingContributions) {
  //   return (
  //     <main className='px-4 text-xs w-full flex items-center justify-center py-20'>
  //       <div className="loading loading-spinner loading-lg"></div>
  //     </main>
  //   );
  // }
  if (isLoadingContributions || !hasLoadedOnce) {
    return (
      <main className='px-4 text-xs w-full flex items-center justify-center py-20'>
        <div className="loading loading-spinner loading-lg"></div>
      </main>
    );
  }

  if (contributionsError) {
    return (
      <main className='px-4 text-xs w-full flex items-center justify-center py-20'>
        <p className='text-red-500'>Error loading contributions: {contributionsError.message}</p>
      </main>
    );
  }


  return (
    <div>
      <p className='mb-2 text-base'>{totalContributionsNumber} contributions in {isLastYearView ? 'the last year' : selectedYear}</p>
      <div className='flex'>
        <div className='border border-custom_border_grey rounded h-fit'>
          <Heatmap />
          <div className='flex p-4 border-t border-custom_border_grey'>
            <ActivityOverview />
            <Radar />
          </div>
        </div>
        <YearSelectionBar />
      </div>
    </div>

  )
}

export default ContributionsIndex