import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons'
import { useGithubContext } from 'context/GithubContext'
import Link from 'next/link'
import Image from 'next/image'

const ActivityOverview = () => {

  const { contributions } = useGithubContext()
  const contributedTo = contributions.commitContributionsByRepository
  console.log(contributedTo)

  type ContributedRepo = typeof contributedTo[number];

  const uniqueOwners = Array.from(
    new Map(
      contributedTo
        .filter((repo: ContributedRepo) => repo.repository.owner.__typename === 'Organization')
        .map((repo: ContributedRepo) => [repo.repository.owner.login, repo])
    ).values()
  );

  return (
    <div className='border-r border-custom_border_grey pr-8 flex-auto'>
      <h2 className='mb-4'>ActivityOverview</h2>

      <div className='flex flex-wrap mb-2'>
        {uniqueOwners.map((repo: ContributedRepo) => (
          <button
           key={repo.repository.owner.login} 
           className='flex p-1 pr-2 border border-custom_border_grey rounded mr-2 mb-2 items-center hover:bg-hover_grey'
           >
            <Image
              src={repo.repository.owner.avatarUrl}
              alt={repo.repository.owner.login}
              width={20}
              height={20}
              className='rounded-md inline-block mr-1 border border-custom_border_grey'
            />
            <p className='text-xs font-medium'>@{repo.repository.owner.login}</p>
          </button>
        ))}
      </div>

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