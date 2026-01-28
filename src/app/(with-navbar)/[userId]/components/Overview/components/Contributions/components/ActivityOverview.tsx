import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faBookBookmark, faTableColumns, faCube, faStar } from '@fortawesome/free-solid-svg-icons'
import { useGithubContext } from 'context/GithubContext'
import Link from 'next/link'

const ActivityOverview = () => {

  const { contributions, selectedYear, isLastYearView } = useGithubContext()
  console.log(contributions.commitContributionsByRepository)

  const contributedTo = contributions.commitContributionsByRepository

    type ContributedRepo = typeof contributedTo[number];

  return (
    <div className='border-r border-custom_border_grey pr-8 flex-auto'>
      <h2 className='mb-4'>ActivityOverview</h2>
      <div className='flex '>
        <FontAwesomeIcon icon={faBookBookmark} className='mt-1 mr-2' />
        <p>
          Contributed to&nbsp;
          {contributedTo.slice(0, 3).map((repo: ContributedRepo, index: number) => (
            <span key={repo.repository.nameWithOwner}>
              <Link
                className='link_button'
                href={repo.repository.url}
              >
                {repo.repository.nameWithOwner}
              </Link>
              {index < 2 && ', '}
            </span>
          ))}
          {contributedTo.length > 3 && ` and ${contributedTo.length - 3} other repositories`}
        </p>
      </div>
    </div>
  )
}

export default ActivityOverview