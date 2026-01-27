import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGithubContext } from 'context/GithubContext'
import { useLazyQuery } from '@apollo/client'
import { GET_CONTRIBUTION_FOR_SPECIFIC_YEAR } from '../../../query'

const YearSelectionBar = () => {

  const {
    userData,
    selectedYear,
    setSelectedYear,
    isLastYearView,
    setIsLastYearView
  } = useGithubContext();

  const createdYear = userData?.user?.createdAt ? new Date(userData.user.createdAt).getFullYear() : null
  const currentYearNum = new Date().getFullYear()
  const years = createdYear
    ? Array.from({ length: currentYearNum - createdYear + 1 }, (_, i) => currentYearNum - i)
    : []

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setIsLastYearView(false); // Switch to calendar year view when a year is clicked
  }

  return (
    <div className='mb-4 ml-6 sticky top-0'>
      {years.map((year) => (
        <div key={year}>
          <button
            className={`${selectedYear === year ? 'bg-custom_blue text-white' : 'hover:bg-navbar_background'}
            text-xs px-4 py-2 mb-2 rounded !cursor-pointer min-w-[84px] w-full text-left`}
            onClick={() => {
              handleYearClick(year)
            }}
          >{year}</button>
        </div>
      ))}
    </div>
  )
}

export default YearSelectionBar