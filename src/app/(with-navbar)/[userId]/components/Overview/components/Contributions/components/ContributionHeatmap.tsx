import { useGithubContext } from 'context/GithubContext'

const ContributionHeatmap = () => {
  const { contributions } = useGithubContext()

  // type ContributionDay = {
  //   date: string;
  //   contributionCount: number;
  //   color: string;
  // };

  // type ContributionWeek = {
  //   contributionDays: {
  //     date: string;
  //     contributionCount: number;
  //     color: string;
  //   }[];
  // };

  // type ContributionCalendar = {
  //   totalContributions: number;
  //   weeks: {
  //     contributionDays: {
  //       date: string;
  //       contributionCount: number;
  //       color: string;
  //     }[];
  //   }[];
  // };



  const contributionCalendar = contributions?.contributionCalendar

  return (
    <div>
      <p className='mb-2 text-base'>{contributionCalendar?.totalContributions.toLocaleString()} contributions in the last year</p>

      <main className='border border-custom_border_grey rounded-t px-4 text-xs w-full'>
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

export default ContributionHeatmap
