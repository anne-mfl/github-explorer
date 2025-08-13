import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGithubContext } from 'context/GithubContext'
import { useLazyQuery } from '@apollo/client'
import { GET_CONTRIBUTION_FOR_SPECIFIC_YEAR } from '../query'

const Contributions = () => {
  const { userData } = useGithubContext()
  const { userId } = useParams() as { userId: string }

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  type ContributionDay = {
    date: string;
    contributionCount: number;
    color: string;
  };

  type ContributionWeek = {
    contributionDays: ContributionDay[];
  };

  type ContributionCalendar = {
    totalContributions: number;
    weeks: ContributionWeek[];
  };

  const [contributionCalendar, setContributionCalendar] = useState<ContributionCalendar | null>(null)

  // Set initial calendar from userData
  useEffect(() => {
    if (userData?.user?.contributionsCollection?.contributionCalendar) {
      setContributionCalendar(userData.user.contributionsCollection.contributionCalendar)
    }
  }, [userData])

  const createdYear = userData?.user?.createdAt ? new Date(userData.user.createdAt).getFullYear() : null
  const currentYearNum = new Date().getFullYear()
  const years = createdYear
    ? Array.from({ length: currentYearNum - createdYear + 1 }, (_, i) => currentYearNum - i)
    : []

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
        },
      })
    } else if (userData?.user?.contributionsCollection?.contributionCalendar) {
      setContributionCalendar(userData.user.contributionsCollection.contributionCalendar)
    }
  }, [selectedYear, userId, fetchYearContributions, userData])
  // useEffect(() => {
  //   if (selectedYear !== new Date().getFullYear()) {
  //     fetchYearContributions({
  //       variables: {
  //         userId: userId,
  //         from: `${selectedYear}-01-01T00:00:00Z`,
  //         to: `${selectedYear}-12-31T23:59:59Z`,
  //       },
  //     })
  //   } else if (userData?.user?.contributionsCollection?.contributionCalendar) {
  //     setContributionCalendar(userData.user.contributionsCollection.contributionCalendar)
  //   }
  // }, [selectedYear, userId, fetchYearContributions, userData])

  // When userQueryData is fetched, update contributionCalendar
  useEffect(() => {
    if (userQueryData?.user?.contributionsCollection?.contributionCalendar && !loading && !error) {
      setContributionCalendar(userQueryData.user.contributionsCollection.contributionCalendar)
    }
  }, [userQueryData, loading, error])

  console.log(contributionCalendar)

  return (
    <div>
      <p className='mb-2 text-base'>{contributionCalendar?.totalContributions.toLocaleString()} contributions in the last year</p>
      <div className='flex mb-4'>
        {years.map((year) => (
          <div key={year}>
            <button
              className={`${selectedYear === year && 'bg-custom_blue text-white'} px-2 py-1 rounded cursor-pointer`}
              onClick={() => setSelectedYear(year)}
            >{year}</button>
          </div>
        ))}
      </div>
      <main className='border border-custom_border_grey rounded px-4 text-xs w-full'>
        <table className='flex items-start overflow-x-auto py-3'>
          <thead className='mr-1.5'>
            <tr className='flex flex-col items-start gap-0.5 [&>th]:font-normal [&>th]:h-2.5'>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th>Mon</th>
              <th>&nbsp;</th>
              <th>Wed</th>
              <th>&nbsp;</th>
              <th>Fri</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody className='flex gap-[3px]'>
            {contributionCalendar?.weeks.map((week, i) => {
              // Calculate how many empty <td/> to add at the start of the first week
              const isFirstWeek = i === 0;
              const missingDays = isFirstWeek ? 7 - week.contributionDays.length : 0;

              return (
                <tr key={i} className='flex flex-col gap-[3px]'>
                  <td className='h-2.5 w-2.5 mb-1.5'>
                    {
                      (i === 0 ||
                        new Date(week.contributionDays[0].date).getMonth() !==
                        new Date(contributionCalendar.weeks[i - 1].contributionDays[0].date).getMonth()
                      ) ? new Date(week.contributionDays[0].date).toLocaleString('en-US', { month: 'short' })
                        : ' '
                    }
                  </td>
                  {/* Add empty <td/> if first week is missing days */}
                  {isFirstWeek && missingDays > 0 &&
                    Array.from({ length: missingDays }).map((_, idx) => (
                      <td key={`empty-${idx}`} className='w-2.5 h-2.5 rounded-xs'>&nbsp;</td>
                    ))
                  }
                  {week.contributionDays.map((day) => (
                    <td
                      key={day.date}
                      className='w-2.5 h-2.5 rounded-xs border-[0.5] border-[#1f23280d] tooltip tooltip-top'
                      data-tip={`${day.contributionCount > 0 ? day.contributionCount : 'No'} contribution${day.contributionCount === 1 ? '' : 's'} on ${new Date(day.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      }).replace(/(\d+)$/, (d) => {
                        const n = parseInt(d, 10);
                        if (n > 3 && n < 21) return `${n}th`;
                        switch (n % 10) {
                          case 1: return `${n}st`;
                          case 2: return `${n}nd`;
                          case 3: return `${n}rd`;
                          default: return `${n}th`;
                        }
                      })}`}
                      style={{ backgroundColor: day.color }}
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className='flex justify-between text-custom_grey px-8 py-2'>
          <p className='hover:text-custom_blue cursor-pointer'>Learn how we count contributions</p>
          <div className='flex items-center gap-1'>
            <p>Less</p>
            <span className='w-2.5 h-2.5 bg-[#EFF2F5] rounded-xs'>&nbsp;</span>
            <span className='w-2.5 h-2.5 bg-[#ACEEBB] rounded-xs'>&nbsp;</span>
            <span className='w-2.5 h-2.5 bg-[#4AC26B] rounded-xs'>&nbsp;</span>
            <span className='w-2.5 h-2.5 bg-[#2DA44E] rounded-xs'>&nbsp;</span>
            <span className='w-2.5 h-2.5 bg-[#116329] rounded-xs'>&nbsp;</span>
            <p>More</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contributions
