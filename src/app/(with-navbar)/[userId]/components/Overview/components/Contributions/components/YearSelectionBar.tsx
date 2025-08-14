import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGithubContext } from 'context/GithubContext'
import { useLazyQuery } from '@apollo/client'
import { GET_CONTRIBUTION_FOR_SPECIFIC_YEAR } from '../../../query'


const YearSelectionBar = () => {

  const { userData, selectedYear, setSelectedYear, setContributions } = useGithubContext();
  const { userId } = useParams() as { userId: string }

  const createdYear = userData?.user?.createdAt ? new Date(userData.user.createdAt).getFullYear() : null
  const currentYearNum = new Date().getFullYear()
  const years = createdYear
    ? Array.from({ length: currentYearNum - createdYear + 1 }, (_, i) => currentYearNum - i)
    : []


  useEffect(() => {
    if (userData?.user?.contributionsCollection?.contributionCalendar) {
      setContributions(userData.user.contributionsCollection)
    }
  }, [userData])


  const [fetchYearContributions, { data: userQueryData, loading, error }] = useLazyQuery(GET_CONTRIBUTION_FOR_SPECIFIC_YEAR)

  // When selectedYear changes, fetch contributions for that year
  useEffect(() => {
    if (selectedYear !== new Date().getFullYear()) {

      const to = new Date(`${selectedYear}-12-31T23:59:59Z`);
      const from = new Date(to);
      from.setUTCDate(from.getUTCDate() - 365);

      fetchYearContributions({
        variables: {
          userId: userId,
          from: from.toISOString(),
          to: to.toISOString(),
          //  from: `${selectedYear}-01-01T00:00:00Z`,
          //  to: `${selectedYear}-12-31T23:59:59Z`,
        },
      })
    } else if (userData?.user?.contributionsCollection?.contributionCalendar) {
      setContributions(userData.user.contributionsCollection)
    }
  }, [selectedYear, userId, fetchYearContributions, userData])


  // When userQueryData is fetched, update contributionCalendar
  useEffect(() => {
    if (userQueryData?.user?.contributionsCollection?.contributionCalendar && !loading && !error) {
      setContributions(userQueryData.user.contributionsCollection)
    }
  }, [userQueryData, loading, error])



  return (
    <div className='mb-4'>
      {years.map((year) => (
        <div key={year}>
          <button
            className={`${selectedYear === year && 'bg-custom_blue text-white'} px-2 py-1 rounded cursor-pointer`}
            onClick={() => setSelectedYear(year)}
          >{year}</button>
        </div>
      ))}
    </div>
  )
}

export default YearSelectionBar