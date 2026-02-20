"use client"

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faBookBookmark, faTableColumns, faCube, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useGithubContext } from 'context/GithubContext';

type Tab = {
  name: string;
  disabled?: boolean;
}

const tabs: Tab[] = [
  { name: "overview" },
  { name: "repositories" },
  { name: "projects", disabled: true },
  { name: "packages", disabled: true },
  { name: "stars" },
];

const tabIcons = {
  overview: faBookOpen,
  repositories: faBookBookmark,
  projects: faTableColumns,
  packages: faCube,
  stars: faStar,
};

const Tab = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const { userId } = useParams();
  const currentTab = useSearchParams().get("tab") || "overview";
  const githubContext = useGithubContext();
  const repoCount = githubContext?.userData?.user?.repositories?.totalCount;
  const starredCount = githubContext?.userData?.user?.starredRepositories?.totalCount;

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

  const currentTabData = tabs.find(tab => tab.name === currentTab);
  const otherTabs = tabs.filter(tab => tab.name !== currentTab);

  const getTabCount = (tabName: string) => {
    if (tabName === 'repositories') return repoCount;
    if (tabName === 'stars') return starredCount;
    return null;
  };

  return (
    <div className='bg-navbar_background border-b border-custom_light_grey px-4 h-11'>
      <ul className='h-full flex items-center gap-4'>
        {/* Desktop: Show all tabs (above 580px) */}
        <div className='hidden min-[580px]:flex h-full items-center gap-4'>
          {tabs.map(({ name, disabled }) => (
            <li
              className={`h-full ${currentTab === name && !disabled ? "border-b-2 border-custom_orange font-semibold" : ""}`}
              key={name}
            >
              {disabled ? (
                <span className='primary_button px-2 py-1.5 flex items-center gap-2 cursor-not-allowed'>
                  <span className='max-sm:hidden'>
                    <FontAwesomeIcon icon={tabIcons[name as keyof typeof tabIcons]} />
                  </span>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </span>
              ) : (
                <Link
                  href={`/${userId}${name === "overview" ? "" : `?tab=${name}`}`}
                  className='cursor-pointer primary_button px-2 py-1.5 flex items-center gap-2'
                >
                  <span className='max-sm:hidden'>
                    <FontAwesomeIcon icon={tabIcons[name as keyof typeof tabIcons]} />
                  </span>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                  {name === "repositories" && repoCount > 0 &&
                    <span className='text-xs bg-hover_grey font-semibold px-2 py-1 rounded-full'>{repoCount}</span>
                  }
                  {name === "stars" && starredCount > 0 &&
                    <span className='text-xs bg-hover_grey font-semibold px-2 py-1 rounded-full'>{starredCount}</span>
                  }
                </Link>
              )}
            </li>
          ))}
        </div>

        {/* Mobile: Show active tab + More dropdown (below 580px) */}
        <div className='flex min-[580px]:hidden h-full items-center gap-4 w-full'>
          {/* Active tab */}
          {currentTabData && (
            <li className='h-full border-b-2 border-custom_orange font-semibold'>
              <Link
                href={`/${userId}${currentTab === "overview" ? "" : `?tab=${currentTab}`}`}
                className='cursor-pointer primary_button px-2 py-1.5 flex items-center gap-2'
              >
                <span className='max-sm:hidden'>
                  <FontAwesomeIcon icon={tabIcons[currentTab as keyof typeof tabIcons]} />
                </span>
                {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
                {currentTab === "repositories" && repoCount > 0 &&
                  <span className='text-xs bg-hover_grey font-semibold px-2 py-1 rounded-full'>{repoCount}</span>
                }
                {currentTab === "stars" && starredCount > 0 &&
                  <span className='text-xs bg-hover_grey font-semibold px-2 py-1 rounded-full'>{starredCount}</span>
                }
              </Link>
            </li>
          )}

          {/* More dropdown */}
          <div className='border-l border-custom_border_grey h-7 w-0 mb-2'></div>
          <li className='relative h-full' ref={dropdownRef}>
            <button
              className='cursor-pointer primary_button px-2 py-1.5 flex items-center gap-2 -ml-1'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              More
              <FontAwesomeIcon icon={faCaretDown} />
            </button>

            {isDropdownOpen && (
              <div className='absolute left-0 mt-0 w-56 bg-white border border-custom_light_grey rounded-lg shadow-lg z-50 p-2'>
                {otherTabs.map(({ name, disabled }) => (
                  <div key={name}>
                    {disabled ? (
                      <span className='flex items-center gap-3 px-4 py-1.5 text-sm text-custom_grey cursor-not-allowed rounded'>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </span>
                    ) : (
                      <Link
                        href={`/${userId}${name === "overview" ? "" : `?tab=${name}`}`}
                        className='flex items-center justify-between px-4 py-1.5 hover:bg-hover_grey rounded'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className='flex items-center gap-3'>
                          <span className='text-sm'>
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </span>
                        </div>
                        {getTabCount(name) && getTabCount(name)! > 0 && (
                          <span className='text-xs bg-hover_grey font-semibold px-2 py-1 rounded-full'>{getTabCount(name)}</span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        </div>
      </ul>
    </div>
  )
}

export default Tab