import React from 'react'
import { useGithubContext } from 'context/GithubContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark, faStar, faCodeFork } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';

const Repositories = () => {

  const { userData } = useGithubContext();
  // if (!userData) {
  //   return <div>Loading...</div>;
  // }

  const pinnedRepos = userData?.user?.pinnedItems?.nodes || [];
  const normalRepos = userData?.user?.repositories?.nodes || [];

  return (
    <div>
      <h2 className='text-base mb-2'>
        {pinnedRepos.length > 0 ? 'Pinned' : 'Popular repositories'}
      </h2>
      <div className='grid grid-cols-2 gap-3'>
        {(pinnedRepos.length > 0 ? pinnedRepos : normalRepos.slice(0, 6)).map((repo) => (
          <section key={repo.id} className='flex flex-col border border-custom_border_grey rounded p-4 text-xs text-custom_grey'>

            <div className=''>
              <div className='flex flex-wrap items-center gap-2'>
                {pinnedRepos.length > 0 && <FontAwesomeIcon icon={faBookBookmark} className='text-sm' />}
                <h3 className='text-custom_blue hover:underline text-sm font-semibold'>
                  <Link href={`/${userData?.user.login}/${repo.name}`}>
                    {repo.name}
                  </Link>
                </h3>
                {!repo.isPrivate && <span className='border border-custom_border_grey rounded-full py-0.2 px-1.5'>Public</span>}
              </div>
            </div>

            <p className='mt-2 grow'>{repo.description ?? ''}</p>

            <div className='flex items-center gap-4 mt-2'>
              <span className='flex items-center gap-1'>
                <span style={{ backgroundColor: repo.primaryLanguage.color }} className='h-3 w-3 rounded-full'>&nbsp;</span>
                {repo.primaryLanguage.name}
              </span>

              {repo.stargazerCount > 0 &&
                <span>
                  <FontAwesomeIcon icon={faStar} className='mr-1' />
                  {repo.stargazerCount > 0 && repo.stargazerCount}
                </span>
              }
              {repo.forkCount > 0 &&
                <span>
                  <FontAwesomeIcon icon={faCodeFork} className='mr-1' />
                  {repo.forkCount > 0 && repo.forkCount}
                </span>
              }

            </div>

          </section>
        ))}
      </div>
    </div>
  )
}

export default Repositories