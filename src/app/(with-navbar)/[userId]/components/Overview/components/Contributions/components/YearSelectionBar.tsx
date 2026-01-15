import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGithubContext } from 'context/GithubContext'
import { useLazyQuery } from '@apollo/client'
import { GET_CONTRIBUTION_FOR_SPECIFIC_YEAR } from '../../../query'

const YearSelectionBar = () => {

  const { userData, selectedYear, setSelectedYear, setContributions, setIsLoadingContributions, setContributionsError } = useGithubContext();
  // const { userId } = useParams() as { userId: string }

  const createdYear = userData?.user?.createdAt ? new Date(userData.user.createdAt).getFullYear() : null
  const currentYearNum = new Date().getFullYear()
  const years = createdYear
    ? Array.from({ length: currentYearNum - createdYear + 1 }, (_, i) => currentYearNum - i)
    : []

  // const [fetchYearContributions, { data: userQueryData, loading, error }] = useLazyQuery(GET_CONTRIBUTION_FOR_SPECIFIC_YEAR)

  // Update context when loading/error states change
  // useEffect(() => {
  //   setIsLoadingContributions(loading);
  //   setContributionsError(error);
  // }, [loading, error, setIsLoadingContributions, setContributionsError])

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


  // When userQueryData is fetched, update contributionCalendar
  // useEffect(() => {
  //   if (userQueryData?.user?.contributionsCollection?.contributionCalendar && !loading && !error) {
  //     setContributions(userQueryData.user.contributionsCollection)
  //   }
  // }, [userQueryData, loading, error])

  return (
    <div className='mb-4 ml-8 w-full'>
      {years.map((year) => (
        <div key={year}>
          <button
            className={`${selectedYear === year ? 'bg-custom_blue text-white' : 'hover:bg-navbar_background'}
            text-xs px-4 py-2 mb-2 rounded !cursor-pointer w-full text-left`}
            onClick={() => setSelectedYear(year)}
          >{year}</button>
        </div>
      ))}
    </div>
  )
}

export default YearSelectionBar