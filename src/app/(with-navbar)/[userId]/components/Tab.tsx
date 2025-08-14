"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faBookBookmark, faTableColumns, faCube, faStar } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useGithubContext } from 'context/GithubContext';

const Tab = () => {

  const tabs = ["overview", "repositories", "projects", "packages", "stars"];

  const { userId } = useParams();
  const currentTab = useSearchParams().get("tab") || "overview";
  const githubContext = useGithubContext();
  const repoCount = githubContext?.userData?.user?.repositories?.totalCount;
  const starredCount = githubContext?.userData?.user?.starredRepositories?.totalCount;

  return (
    <div className='bg-navbar_background border-b border-custom_light_grey px-4 h-11'>
      <ul className={`h-full flex items-center gap-4`}>
        {tabs.map((tab) => (
          <li className={currentTab === tab ? "border-b-2 border-custom_orange font-semibold h-full" : "h-full"} key={tab}>
            <Link
              href={`/${userId}${tab === "overview" ? "" : `?tab=${tab}`}`}
              className='cursor-pointer primary_button px-2 py-1.5 flex items-center gap-2'
            >
              <FontAwesomeIcon icon={tab === "overview" ? faBookOpen : tab === "repositories" ? faBookBookmark : tab === "projects" ? faTableColumns : tab === "packages" ? faCube : faStar} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "repositories" && repoCount > 0 &&
                <span className='text-xs bg-hover_grey font-semibold px-2 py-1 rounded-full'>{repoCount}</span>
              }
              {tab === "stars" && starredCount > 0 &&
                <span className='text-xs bg-hover_grey font-semibold px-2 py-1 rounded-full'>{starredCount}</span>
              }
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tab