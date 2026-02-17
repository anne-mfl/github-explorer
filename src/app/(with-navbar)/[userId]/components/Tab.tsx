"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faBookBookmark, faTableColumns, faCube } from '@fortawesome/free-solid-svg-icons'
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
  const { userId } = useParams();
  const currentTab = useSearchParams().get("tab") || "overview";
  const githubContext = useGithubContext();
  const repoCount = githubContext?.userData?.user?.repositories?.totalCount;
  const starredCount = githubContext?.userData?.user?.starredRepositories?.totalCount;

  return (
    <div className='bg-navbar_background border-b border-custom_light_grey px-4 h-11'>
      <ul className='h-full flex items-center gap-4'>
        {tabs.map(({ name, disabled }) => (
          <li
            className={`h-full ${currentTab === name && !disabled ? "border-b-2 border-custom_orange font-semibold" : ""}`}
            key={name}
          >
            {disabled ? (
              <span className='primary_button px-2 py-1.5 flex items-center gap-2 cursor-not-allowed'>
                <FontAwesomeIcon icon={tabIcons[name as keyof typeof tabIcons]} />
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </span>
            ) : (
              <Link
                href={`/${userId}${name === "overview" ? "" : `?tab=${name}`}`}
                className='cursor-pointer primary_button px-2 py-1.5 flex items-center gap-2'
              >
                <FontAwesomeIcon icon={tabIcons[name as keyof typeof tabIcons]} />
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
      </ul>
    </div>
  )
}

export default Tab