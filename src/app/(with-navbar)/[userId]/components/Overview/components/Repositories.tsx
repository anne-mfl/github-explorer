import React from 'react'
import { useGithubContext } from 'context/GithubContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark, faCodeFork } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import type { GetUserOverviewQuery } from '@/types/github-generated';


const Repositories = () => {

  const { userData } = useGithubContext();
  const pinnedRepos = userData?.user?.pinnedItems?.nodes || [];
  const normalRepos = userData?.user?.repositories?.nodes || [];

  type Repo = typeof normalRepos[number];

  return (
    <div>
      <h2 className='text-base mb-2'>
        {pinnedRepos.length > 0 ? 'Pinned' : 'Popular repositories'}
      </h2>
      <div className='grid grid-cols-2 gap-3 max-md:grid-cols-1'>
        {(pinnedRepos.length > 0 ? pinnedRepos : normalRepos.slice(0, 6)).map((repo: Repo) => (
          <section key={repo?.id} className='flex flex-col border border-custom_border_grey rounded p-4 text-xs text-custom_grey'>

            <div className=''>
              <div className='flex flex-wrap justify-between items-center gap-2'>
                <div className='flex gap-2 items-center'>
                  {pinnedRepos.length > 0 && <FontAwesomeIcon icon={faBookBookmark} className='text-sm' />}
                  <h3 className='link_button text-sm'>
                    <Link href={`https://github.com/${userData?.user?.login}/${repo?.name}`} target="_blank">
                      {/* <Link href={`/${userData?.user?.login}/${repo?.name}`}> */}
                      {repo?.name}
                    </Link>
                  </h3>
                </div>
                {repo?.isPrivate
                  ? <span className='private_public_badge'>Private</span>
                  : <span className='private_public_badge'>Public</span>
                }
              </div>
            </div>

            <p className='mt-2 grow'>{repo?.description ?? ''}</p>

            <div className='flex items-center gap-4 mt-2'>
              {repo?.primaryLanguage && (
                <span className='flex items-center gap-1'>
                  <span style={{ backgroundColor: repo.primaryLanguage.color ?? '#ccc' }} className='h-3 w-3 rounded-full'>&nbsp;</span>
                  {repo.primaryLanguage.name}
                </span>
              )}

              {(repo?.stargazerCount ?? 0) > 0 && (
                <span className='flex items-center'>
                  <FontAwesomeIcon icon={faStar} className='mr-1' />
                  {repo.stargazerCount}
                </span>
              )}

              {(repo?.forkCount ?? 0) > 0 && (
                <span>
                  <FontAwesomeIcon icon={faCodeFork} className='mr-1' />
                  {repo.forkCount}
                </span>
              )}
            </div>

          </section>
        ))}
      </div>
    </div>
  )
}

export default Repositories