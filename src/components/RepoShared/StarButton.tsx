'use client'

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faStar, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface StarButtonProps {
  sponsor?: { platform: string; url: string }[] | null;
}

const MOCK_LISTS = [
  { id: '1', name: '💡 Future ideas', emoji: '💡' },
  { id: '2', name: '🚀 My stack', emoji: '🚀' },
  { id: '3', name: '✨ Inspiration', emoji: '✨' },
];

const StarButton = ({ sponsor = null }: StarButtonProps) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className='flex items-center gap-2'>
      {sponsor && sponsor.length > 0 && (
        <div className='flex h-7'>
          <Link href={sponsor[0].url}>
            <button className='grey_button px-3 rounded-md font-normal text-xs flex items-center'>
              <FontAwesomeIcon icon={faHeart} className='mr-2 text-[#BF3989] text-sm' />
              Sponsor
            </button>
          </Link>
        </div>
      )}
      <div className='relative' ref={dropdownRef}>
        <div className='flex h-7'>
          <button className='grey_button px-3 rounded-none rounded-l-md font-normal text-xs flex items-center'>
            <FontAwesomeIcon icon={faStar} className='mr-2 text-sm' />
            Star
          </button>
          <button
            className='grey_button px-3 rounded-none rounded-r-md border-l-0'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FontAwesomeIcon icon={faCaretDown} className='mb-0.5' />
          </button>
        </div>



        {isDropdownOpen && (
          <div className='absolute right-0 mt-2 w-72 bg-white border border-custom_light_grey rounded-lg shadow-lg z-50'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 border-b border-custom_light_grey'>
              <h3 className='font-semibold text-sm'>Lists</h3>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className='text-custom_grey hover:text-custom_black'
              >
                <FontAwesomeIcon icon={faXmark} className='w-4 h-4' />
              </button>
            </div>

            {/* List items */}
            <div className='py-2'>
              {MOCK_LISTS.map((list) => (
                <label
                  key={list.id}
                  className='flex items-center px-4 py-2 hover:bg-hover_grey cursor-pointer'
                >
                  <input
                    type='checkbox'
                    className='mr-3 w-4 h-4 rounded border-custom_light_grey'
                  />
                  <span className='text-sm'>{list.name}</span>
                </label>
              ))}
            </div>

            {/* Create list button */}
            <div className='border-t border-custom_light_grey'>
              <button className='w-full text-left px-4 py-3 text-sm text-custom_grey hover:text-custom_blue flex items-center'>
                <span className='mr-2'>+</span>
                Create list
              </button>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default StarButton;