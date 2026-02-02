'use client';

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_REPOSITORIES } from './query'
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCodeFork, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { getRelativeTime } from '@/utils/formatDate';
import { fetchCommitActivity } from '@/utils/fetchCommitActivity';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { get } from 'http';



const Repositories = () => {

  const [commitData, setCommitData] = useState<{ [key: string]: number[] }>({});
  const { userId } = useParams() as { userId: string };
  const { data: userRepositories, loading: userLoading, error: userError } = useQuery(GET_USER_REPOSITORIES, {
    variables: {
      userId: userId,
      first: 30,
      orderBy: "UPDATED_AT",
      direction: "DESC",
      ownerAffiliations: ["OWNER"]
    },
    fetchPolicy: 'cache-first',
  });

  // console.log(userRepositories?.user.repositories.nodes)

  useEffect(() => {
    const fetchAllCommitActivities = async () => {
      if (!userRepositories?.user.repositories.nodes) return;
      setCommitData(prev => ({ ...prev })); // keep existing data
      for (const repo of userRepositories.user.repositories.nodes) {
        const data = await fetchCommitActivity(userId, repo.name);
        if (data) {
          setCommitData(prev => ({
            ...prev,
            [repo.id]: data,
          }));
        }
      }
    };
    fetchAllCommitActivities();
  }, [userRepositories, userId]);



  if (userLoading) return <Loading />;
  if (userError) return <p className='text-red-500'>Error: {userError.message}</p>;

  return (
    <>
      <div className='flex py-4 border-b border-custom_light_grey'>
        <input
          type='text'
          placeholder='Find a repository...'
          className='h-8 border border-custom_light_grey rounded-lg w-96 pl-4 pr-10 mr-2'
        />
        <div className='flex gap-2 [&>button]:flex [&>button]:items-center'>
          <button className='grey_button'>
            Type <FontAwesomeIcon icon={faCaretDown} className='ml-1' />
          </button>
          <button className='grey_button'>
            Language <FontAwesomeIcon icon={faCaretDown} className='ml-1' />
          </button>
          <button className='grey_button'>
            Sort <FontAwesomeIcon icon={faCaretDown} className='ml-1' />
          </button>
        </div>
      </div>

      <ul className='text-custom_grey'>
        {userRepositories?.user.repositories.nodes.map((repo: any) => (
          <li
            key={repo.id}
            className='py-6 border-b border-custom_light_grey flex justify-between'
          >
            <section>
              <div className='mb-1 flex items-center'>
                <Link href={repo.url} className='link_button text-xl'>{repo.name}</Link>
                <div className='mb-0.5'>
                  {repo.isPrivate
                    ? <span className='private_public_badge mb-1'>Private</span>
                    : <span className='private_public_badge mb-1'>Public</span>
                  }
                </div>
              </div>

              {repo.isFork &&
                <p className='text-xs mb-1'>
                  Forked from
                  <Link href={repo.parent?.url} className='link_secondary underline ml-1'>{repo.parent?.nameWithOwner}</Link>
                </p>
              }

              <p className='mb-4 pr-5'>{repo.description}</p>

              {repo.repositoryTopics && repo.repositoryTopics.nodes.length > 0 && (
                <div className='flex flex-wrap gap-1 mb-3'>
                  {repo.repositoryTopics.nodes.map((topicNode: any) => (
                    <Link key={topicNode.topic.name} href={`https://github.com/topics/${topicNode.topic.name}`}>
                      <span className='bg-custom_light_blue text-custom_blue px-2 py-1 rounded-full text-xs hover:bg-custom_blue hover:text-white'>
                        {topicNode.topic.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              <div className='text-xs flex items-center mt-2 [&>span]:mr-4'>
                {repo.primaryLanguage &&
                  <span className='flex items-center gap-1 mr-4'>
                    <span style={{ backgroundColor: repo.primaryLanguage.color ?? '#ccc' }} className='h-3 w-3 rounded-full'>&nbsp;</span>
                    {repo.primaryLanguage.name}
                  </span>
                }
                {repo.stargazerCount > 0 &&
                  <span className='hover:text-custom_blue'>
                    <Link href={`${repo.url}/stargazers`}>
                      <FontAwesomeIcon icon={faStar} className='mr-1' />
                      {repo.stargazerCount.toLocaleString()}
                    </Link>
                  </span>
                }
                {repo.forkCount > 0 &&
                  <span className='hover:text-custom_blue'>
                    <Link href={`${repo.url}/forks`}>
                      <FontAwesomeIcon icon={faCodeFork} className='mr-1' />
                      {repo.forkCount.toLocaleString()}
                    </Link>
                  </span>
                }
                {repo.licenseInfo &&
                  <span>
                    <FontAwesomeIcon icon={faScaleBalanced} className='mr-1' />
                    {repo.licenseInfo.name}
                  </span>
                }
                {repo.pushedAt &&
                  <span>
                    Updated {getRelativeTime(repo.pushedAt)}
                  </span>
                }
              </div>
            </section>

            <section className='ml-16'>
              <div className='flex'>
                <button className='grey_button rounded-none rounded-l-md font-normal text-xs'>
                  <FontAwesomeIcon icon={faStar} className='mr-2 w-4 h-4' />
                  Star
                </button>
                <button className='grey_button rounded-none rounded-r-md border-l-0'>
                  <FontAwesomeIcon icon={faCaretDown} />
                </button>
              </div>
              <div className='h-15 flex items-center'>
                <Sparklines
                  data={commitData[repo.id] ?? new Array(52).fill(0)}
                  width={150} height={24} margin={5}
                >
                  <SparklinesLine color="#3fb950" style={{ fill: "none", strokeWidth: 2 }} />
                </Sparklines>
              </div>
            </section>


          </li>
        ))}
      </ul>
    </>
  )
}

export default Repositories