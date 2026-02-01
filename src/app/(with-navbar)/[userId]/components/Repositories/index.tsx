import React from 'react'
import { useQuery } from '@apollo/client';
import { GET_USER_REPOSITORIES } from './query'
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Repositories = () => {
  const { userId } = useParams() as { userId: string };

  const { data: userRepositories, loading: userLoading, error: userError } = useQuery(GET_USER_REPOSITORIES, {
    variables: {
      userId: userId,
      first: 20,
      orderBy: "UPDATED_AT",
      direction: "DESC",
      ownerAffiliations: ["OWNER"]
    },
    fetchPolicy: 'cache-first',
  });

  if (userLoading) return <Loading />;
  if (userError) return <p className='text-red-500'>Error: {userError.message}</p>;

  return (
    <>
      <div className='flex'>
        <input
          type='text'
          placeholder='Find a repository...'
          className='h-8 border border-custom_light_grey rounded-lg w-96 pl-4 pr-10 mr-2'
        />
        <div className='flex gap-2'>
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

      <ul>
        {userRepositories?.user.repositories.nodes.map((repo: any) => (
          <li key={repo.id}>
            <a href={repo.url}>{repo.name}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Repositories