'use client'

import { useState, useMemo } from 'react';
import { useGithubContext } from 'context/GithubContext'
import Link from 'next/link'
import type { ContributionCalendarDay, ContributionCalendarWeek } from '@/types/github-generated'


const ContributionHeatmap = () => {
  const { contributions, selectedYear, isLastYearView } = useGithubContext()
  const contributionCalendar = contributions?.contributionCalendar
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  // Pad the weeks with future days if viewing current year
  const paddedWeeks = useMemo(() => {
    if (!contributionCalendar?.weeks) return [];
    
    const currentYear = new Date().getFullYear();
    const isCurrentYear = selectedYear === currentYear && !isLastYearView;
    
    if (!isCurrentYear) {
      return contributionCalendar.weeks;
    }

    // Clone the weeks array
    const weeks = JSON.parse(JSON.stringify(contributionCalendar.weeks));
    
    // Get the last day in the calendar
    const lastWeek = weeks[weeks.length - 1];
    const lastDay = lastWeek.contributionDays[lastWeek.contributionDays.length - 1];
    const lastDate = new Date(lastDay.date);
    
    // Calculate end of year
    const endOfYear = new Date(currentYear, 11, 31); // Dec 31
    
    // Add future days until end of year
    let currentDate = new Date(lastDate);
    currentDate.setDate(currentDate.getDate() + 1);
    
    while (currentDate <= endOfYear) {
      const dayOfWeek = currentDate.getDay();
      
      // If it's Sunday (0) and not the first iteration, create a new week
      if (dayOfWeek === 0 && weeks[weeks.length - 1].contributionDays.length > 0) {
        weeks.push({
          contributionDays: []
        });
      }
      
      // Add the future day to the current week
      const currentWeek = weeks[weeks.length - 1];
      currentWeek.contributionDays.push({
        date: currentDate.toISOString().split('T')[0],
        contributionCount: 0,
        color: '#ebedf0' // GitHub's default gray for no contributions
      });
      
      // Move to next day
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      currentDate = nextDate;
    }
    
    return weeks;
  }, [contributionCalendar, selectedYear, isLastYearView]);

  return (
    <main className='px-4 text-xs relative'>
      {/* Custom Tooltip */}
      {hoveredDay && (
        <div 
          className='absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-50 whitespace-nowrap'
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y - 35}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {hoveredDay.count > 0 ? hoveredDay.count : 'No'} contribution{hoveredDay.count === 1 ? '' : 's'} on {new Date(hoveredDay.date).toLocaleDateString('en-US', {
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
          })}
        </div>
      )}

      <div className='overflow-x-auto py-3'>
        <table className='flex'>
          <thead className='mr-1.5'>
            <tr className='flex flex-col items-start gap-[3px] [&>th]:font-normal [&>th]:h-2.5'>
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
            {paddedWeeks.map((week: ContributionCalendarWeek, i: number) => {
              const isFirstWeek = i === 0;
              const missingDays = isFirstWeek ? 7 - week.contributionDays.length : 0;

              return (
                <tr key={`week-${i}`} className='flex flex-col gap-[3px]'>
                  <td className='h-2.5 w-2.5 mb-1.5'>
                    {
                      (() => {
                        const firstDayDate = new Date(week.contributionDays[0].date);
                        const firstDayMonth = firstDayDate.getMonth();
                        const firstDayYear = firstDayDate.getFullYear();

                        // Only show month if it's from the selected year (if not in last year view)
                        if (!isLastYearView && firstDayYear !== selectedYear) {
                          return ' ';
                        }

                        // Check if this is a month change
                        const isMonthChange = i === 0 ||
                          firstDayMonth !== new Date(paddedWeeks[i - 1].contributionDays[0].date).getMonth();

                        if (!isMonthChange) {
                          return ' ';
                        }

                        // If this is the first week and there's a month change in the next few weeks, skip this label
                        if (i === 0 && paddedWeeks.length > 4) {
                          // Check if there's another month change within the next 4 weeks
                          for (let j = 1; j <= Math.min(4, paddedWeeks.length - 1); j++) {
                            const nextWeekDate = new Date(paddedWeeks[j].contributionDays[0].date);
                            if (nextWeekDate.getMonth() !== firstDayMonth) {
                              return ' '; // Skip this label to avoid overlap
                            }
                          }
                        }

                        return firstDayDate.toLocaleString('en-US', { month: 'short' });
                      })()
                    }
                  </td>
                  {/* Add empty <td/> if first week is missing days */}
                  {isFirstWeek && missingDays > 0 &&
                    Array.from({ length: missingDays }).map((_, idx) => (
                      <td key={`empty-${idx}`} className='w-2.5 h-2.5 rounded-xs'>&nbsp;</td>
                    ))
                  }
                  {week.contributionDays.map((day: ContributionCalendarDay, dayIndex: number) => (
                    <td
                      key={`${day.date}-${i}-${dayIndex}`}
                      className='w-2.5 h-2.5 rounded-xs border-[0.5] border-[#1f23280d] cursor-pointer'
                      style={{ backgroundColor: day.color }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const parentRect = e.currentTarget.closest('main')?.getBoundingClientRect();
                        setHoveredDay({
                          date: day.date,
                          count: day.contributionCount,
                          x: rect.left - (parentRect?.left || 0) + rect.width / 2,
                          y: rect.top - (parentRect?.top || 0)
                        });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className='flex justify-between text-custom_grey px-8 py-2'>
        <p className='hover:text-custom_blue cursor-pointer'>
          <Link href='https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions'>
            Learn how we count contributions
          </Link>
        </p>
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
  )
}

export default ContributionHeatmap