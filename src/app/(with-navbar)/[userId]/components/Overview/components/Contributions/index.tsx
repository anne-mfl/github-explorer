import React, { useEffect } from 'react'
import Heatmap from './components/ContributionHeatmap'
import YearSelectionBar from './components/YearSelectionBar'
import Radar from './components/ContributionRadar'
import { useGithubContext } from 'context/GithubContext';
import { useParams } from 'next/navigation'
import { useLazyQuery } from '@apollo/client'
import { GET_CONTRIBUTION_FOR_SPECIFIC_YEAR } from '../../query'


const ContributionsIndex = () => {

  const { userData, selectedYear, setSelectedYear, setContributions, isLoadingContributions, setIsLoadingContributions, contributionsError, setContributionsError } = useGithubContext();
  const { userId } = useParams() as { userId: string }

  const [fetchYearContributions, { data: userQueryData, loading, error }] = useLazyQuery(GET_CONTRIBUTION_FOR_SPECIFIC_YEAR)

  useEffect(() => {
    setIsLoadingContributions(loading);
    setContributionsError(error);
  }, [loading, error, setIsLoadingContributions, setContributionsError])

  useEffect(() => {
    const to = new Date(`${selectedYear}-12-31T23:59:59Z`);
    const from = new Date(`${selectedYear}-01-01T00:00:00Z`);
    fetchYearContributions({
      variables: {
        userId: userId,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    })
  }, [selectedYear, userId, fetchYearContributions])

  useEffect(() => {
    if (userQueryData?.user?.contributionsCollection?.contributionCalendar && !loading && !error) {
      setContributions(userQueryData.user.contributionsCollection)
    }
  }, [userQueryData, loading, error])


  if (isLoadingContributions) {
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
    <div className='flex'>
      <div>
        <Heatmap />
        <Radar />
      </div>
      <YearSelectionBar />
    </div>
  )
}

export default ContributionsIndex