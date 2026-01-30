'use client'

import { useEffect, useState } from 'react'
import Heatmap from './components/ContributionHeatmap'
import YearSelectionBar from './components/YearSelectionBar'
import Radar from './components/ContributionRadar'
import { useGithubContext } from 'context/GithubContext';
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useLazyQuery } from '@apollo/client'
import { GET_CONTRIBUTION_FOR_SPECIFIC_YEAR } from '../../query'
import ActivityOverview from './components/ActivityOverview';
import type { GetContributionForSpecificYearQuery, GetContributionForSpecificYearQueryVariables } from '@/types/github-generated'


const ContributionsIndex = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userId } = useParams() as { userId: string }

  const {
    userData,
    selectedYear,
    setSelectedYear,
    contributions,
    setContributions,
    isLoadingContributions,
    setIsLoadingContributions,
    contributionsError,
    setContributionsError,
    isLastYearView,
    setIsLastYearView,
  } = useGithubContext();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [fetchYearContributions, { data: userQueryData, loading, error }] = useLazyQuery<
    GetContributionForSpecificYearQuery,
    GetContributionForSpecificYearQueryVariables
  >(GET_CONTRIBUTION_FOR_SPECIFIC_YEAR)

  const totalContributionsNumber = contributions?.contributionCalendar?.totalContributions.toLocaleString()

  // Initialize state from URL on mount (only once)
  useEffect(() => {
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    if (fromParam && toParam) {
      const fromDate = new Date(fromParam)
      const year = fromDate.getFullYear()
      setSelectedYear(year)
      setIsLastYearView(false)
    } else {
      // Default to last year view
      setIsLastYearView(true)
    }

    setIsInitialized(true)
  }, [])

  // Update URL when year selection changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const currentYear = new Date().getFullYear()
    let newUrl = `/${userId}`

    if (!isLastYearView) {
      const params = new URLSearchParams()

      // Add tab=overview for specific year views
      params.set('tab', 'overview')

      if (selectedYear === currentYear) {
        // For current year, show from Jan 1 to today
        const today = new Date()
        params.set('from', `${selectedYear}-01-01`)
        params.set('to', today.toISOString().split('T')[0])
      } else {
        // For past years, show full year
        params.set('from', `${selectedYear}-01-01`)
        params.set('to', `${selectedYear}-12-31`)
      }

      newUrl = `/${userId}?${params.toString()}`
    }

    // Update URL without page reload
    router.push(newUrl, { scroll: false })
  }, [selectedYear, isLastYearView, isInitialized, userId, router])

  useEffect(() => {
    setIsLoadingContributions(loading);
    setContributionsError(error);
  }, [loading, error, setIsLoadingContributions, setContributionsError])

  useEffect(() => {
    if (!isInitialized) return;

    let from: Date;
    let to: Date;

    if (isLastYearView) {
      // Show contributions from last 365 days
      to = new Date();
      from = new Date();
      from.setDate(from.getDate() - 365);
    } else {
      // const currentYear = new Date().getFullYear()
      // if (selectedYear === currentYear) {
      //   // For current year, fetch until today
      //   to = new Date()
      //   from = new Date(selectedYear, 0, 1)
      // } else {
      //   // For past years, fetch full year
      //   to = new Date(`${selectedYear}-12-31T23:59:59Z`);
      //   from = new Date(`${selectedYear}-01-01T00:00:00Z`);
      // }

      // Show contributions for the selected calendar year (Jan 1 to Dec 31)
      from = new Date(`${selectedYear}-01-01T00:00:00Z`);
      to = new Date(`${selectedYear}-12-31T23:59:59Z`);
    }

    fetchYearContributions({
      variables: {
        userId: userId,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    })
  }, [selectedYear, userId, fetchYearContributions, isLastYearView, isInitialized])

  useEffect(() => {
    if (userQueryData?.user?.contributionsCollection?.contributionCalendar && !loading && !error) {
      setContributions(userQueryData.user.contributionsCollection)
      setHasLoadedOnce(true)
    }
  }, [userQueryData, loading, error, setContributions])

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
    <div className=''>
      <p className='mb-2 text-base'>{totalContributionsNumber} contributions in {isLastYearView ? 'the last year' : selectedYear}</p>
      <div className='flex w-full min-w-0'>
        <div className='border border-custom_border_grey rounded flex-1 min-w-0 max-w-min h-fit'>
          <Heatmap />
          <div className='flex p-4 border-t border-custom_border_grey'>
            <ActivityOverview />
            <Radar />
          </div>
        </div>
        <div className=''>
          <YearSelectionBar />
        </div>
      </div>
    </div>
  )
}

export default ContributionsIndex