'use client';

import { useState, useRef, useEffect } from 'react';
import { useGithubContext } from 'context/GithubContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const YearSelectionBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    userData,
    selectedYear,
    setSelectedYear,
    isLastYearView,
    setIsLastYearView
  } = useGithubContext();

  const createdYear = userData?.user?.createdAt ? new Date(userData.user.createdAt).getFullYear() : null;
  const currentYearNum = new Date().getFullYear();
  const years = createdYear
    ? Array.from({ length: currentYearNum - createdYear + 1 }, (_, i) => currentYearNum - i)
    : [];

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setIsLastYearView(false);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div>
      {/* Desktop vertical year list */}
      <div className='mb-4 ml-6 sticky top-0 max-lg:hidden'>
        {years.map((year) => (
          <div key={year}>
            <button
              className={`${selectedYear === year ? 'bg-custom_blue text-white' : 'hover:bg-navbar_background'}
                text-xs px-4 py-2 mb-2 rounded !cursor-pointer min-w-[84px] w-full text-left`}
              onClick={() => handleYearClick(year)}
            >
              {year}
            </button>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet dropdown */}
      <div className='hidden max-lg:flex items-center justify-between my-4'>
        <h3 className='text-base mb-2'>Contribution activity</h3>
        <div className='relative' ref={dropdownRef}>
          <button
            className='grey_button font-normal w-full flex items-center justify-between px-3 py-1'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className='text-custom_grey'>Year:&nbsp;</span>
            <span className='mr-2'>{selectedYear}</span>
            <FontAwesomeIcon icon={faCaretDown} />
          </button>

          {isDropdownOpen && (
            <div className='absolute right-0 w-48 mt-2 p-2 bg-white border border-custom_light_grey rounded-lg shadow-lg z-50 overflow-y-auto max-h-60'>
              {years.map((year) => (
                <button
                  key={year}
                  className={`w-full text-left px-2 py-1.5 rounded hover:bg-hover_grey cursor-pointer`}
                  onClick={() => handleYearClick(year)}
                >
                  {selectedYear === year ? <span className='mr-2'>✓</span> : <span className='mr-6' />}
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearSelectionBar;