"use client"

import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client';
import { GET_USERS } from './queries';
import { GET_REPOSITORIES } from './queries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark, faMagnifyingGlass, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useGithubContext } from "context/GithubContext";
import { useRouter } from "next/navigation";



interface SearchProps {
  isInNavbar?: boolean;
}

const Search = ({ isInNavbar = false }: SearchProps) => {

  const [inputValue, setInputValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();
  const { setUserId } = useGithubContext();

  const [getUsers, { data: userData, loading: userLoading, error: userError }] = useLazyQuery(GET_USERS, {
    variables: {
      searchQuery: inputValue,
    },
  })

  const [getRepos, { data: repoData, loading: repoLoading, error: repoError }] = useLazyQuery(GET_REPOSITORIES, {
    variables: {
      searchQuery: inputValue,
    }
  })

  const handleNavigation = (userId: string) => {
    setUserId(userId)
    setInputValue('')
    router.push(`/user/${userId}`);
  }


  // Handle modal state
  useEffect(() => {
    if (isInNavbar) {
      setIsModalOpen(inputValue !== '');
    }
  }, [inputValue, isInNavbar]);

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInputValue('');
        setIsModalOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isInNavbar && isModalOpen) {
        const searchContainer = document.getElementById('search-container');
        const searchResults = document.getElementById('search-results');

        // Close modal if clicking outside search container OR on the search results background
        if (searchContainer && !searchContainer.contains(e.target as Node)) {
          setInputValue('');
          setIsModalOpen(false);
        }
      }
    };

    if (isInNavbar && isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isInNavbar, isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.trim()) {
      getUsers();
      getRepos();
    }
  };

  const handleClear = () => {
    setInputValue('');
    setIsModalOpen(false);
  };


  const SearchResults = () => (
    <>
      {(userLoading && repoLoading) && <p className="px-4 py-2">Loading...</p>}

      {userError && <p className="px-4 py-2 text-red-500">Users Error: {userError.message}</p>}
      {repoError && <p className="px-4 py-2 text-red-500">Repos Error: {repoError.message}</p>}

      {(userData && inputValue !== '') &&
        <ul className='w-full px-4'>
          <p className='text-custom_grey text-xs p-2'>Owners</p>
          {userData.search.nodes.map((user: { name: string; login: string }, i: number) => (
            <li
              onClick={() => handleNavigation(user.login)}
              key={`${user.name}_${user.login}_${i}`}
              className='flex items-center justify-between btn px-2 py-1.5 cursor-pointer'
            >
              <div className='flex items-center gap-2'>
                <FontAwesomeIcon icon={faBookBookmark} />
                <p className=''>{user.login}</p>
              </div>
              <button className='text-custom_grey'>Jump to</button>
            </li>
          ))}
        </ul>
      }

      {(userData && userData.search.nodes.length > 0 && repoData && repoData.search.nodes.length > 0) &&
        <div className='w-full border-b border-custom_light_grey'>&nbsp;</div>
      }

      {(repoData && inputValue !== '') &&
        <ul className='w-full px-4'>
          <p className='text-custom_grey text-xs p-2'>Repositories</p>
          {repoData.search.nodes.map((repo: any) => (
            <li key={`${repo.name}_${repo.owner.login}`} className='flex items-center justify-between btn px-2 py-1.5'>
              <div className='flex items-center gap-2'>
                <FontAwesomeIcon icon={faBookBookmark} />
                <p className='truncate max-w-58'>
                  {repo.owner.login}/{repo.name}
                </p>
              </div>
              <button className='text-custom_grey'>Jump to</button>
            </li>
          ))}
        </ul>
      }
    </>
  );

  if (isInNavbar) {
    return (
      <>
        <div className="relative" id="search-container">
          <div className='px-4 relative'>
            <span className='absolute left-6 top-1/2 transform -translate-y-1/2 text-custom_grey'>
              <FontAwesomeIcon icon={faMagnifyingGlass} className='' />
            </span>
            <input
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              placeholder='Search GitHub Users or Repositories'
              className='h-8 border border-custom_light_grey rounded-lg w-96 pl-7 pr-10'
            />
            <span
              onClick={handleClear}
              className='absolute right-6 top-1/2 transform -translate-y-1/2 text-custom_grey hover:bg-custom_light_grey cursor-pointer px-1.5 py-1 rounded-lg'
            >
              <FontAwesomeIcon icon={faCircleXmark} className='' />
            </span>
          </div>

          {/* Modal overlay and results */}
          {isModalOpen && (
            <>
              {/* Dark overlay */}
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => {
                  setInputValue('');
                  setIsModalOpen(false);
                }}
              />

              {/* Search results container */}
              <div
                id="search-results"
                className="absolute -top-4 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg  overflow-y-auto z-50"
                onClick={(e) => {
                  // Close modal if clicking on the background of the search results
                  if (e.target === e.currentTarget) {
                    setInputValue('');
                    setIsModalOpen(false);
                  }
                }}
              >
                <section className={`${inputValue !== '' ? 'border border-custom_light_grey rounded-lg' : ''} flex flex-col items-center justify-center gap-2 py-[11px] overflow-y-auto max-h-125 `}>
                  <div className='px-4 relative'>
                    <span className='absolute left-6 top-1/2 transform -translate-y-1/2 text-custom_grey'>
                      <FontAwesomeIcon icon={faMagnifyingGlass} className='' />
                    </span>
                    <input
                      type='text'
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder='Search GitHub Users or Repositories'
                      className='h-8 border border-custom_light_grey rounded-lg w-96 pl-7 pr-10'
                    />
                    <span
                      onClick={handleClear}
                      className={`${inputValue === '' && 'hidden'} absolute right-6 top-1/2 transform -translate-y-1/2 text-custom_grey hover:bg-custom_light_grey cursor-pointer px-1.5 py-1 rounded-lg`}
                    >
                      <FontAwesomeIcon icon={faCircleXmark} className='' />
                    </span>
                  </div>
                  <SearchResults />
                </section>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  // Home page version (original behavior)
  return (
    <section className={`${inputValue !== '' ? 'border border-custom_light_grey rounded-lg' : ''} flex flex-col items-center justify-center gap-2 py-4 overflow-y-auto max-h-125`}>
      <div className='px-4 relative'>
        <span className='absolute left-6 top-1/2 transform -translate-y-1/2 text-custom_grey'>
          <FontAwesomeIcon icon={faMagnifyingGlass} className='' />
        </span>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='Search GitHub Users or Repositories'
          className='h-8 border border-custom_light_grey rounded-lg w-96 pl-7 pr-10'
        />
        <span
          onClick={handleClear}
          className='absolute right-6 top-1/2 transform -translate-y-1/2 text-custom_grey hover:bg-custom_light_grey cursor-pointer px-1.5 py-1 rounded-lg'
        >
          <FontAwesomeIcon icon={faCircleXmark} className='' />
        </span>
      </div>

      <SearchResults />
    </section>
  );
};

export default Search;