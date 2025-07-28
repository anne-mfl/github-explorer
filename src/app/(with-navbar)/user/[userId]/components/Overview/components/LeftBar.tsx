import React from 'react'
import { useGithubContext } from 'context/GithubContext';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope, faLink, faBuilding, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const LeftBar = () => {

  const { userData } = useGithubContext();
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-74'>
      <div className='relative w-full aspect-square'>
        <Image
          src={userData?.user?.avatarUrl}
          alt={`${userData?.user?.name || userData?.user?.login}'s avatar`}
          fill
          className='rounded-full mb-4 object-cover border border-custom_light_grey'
        />
      </div>
      <div className='py-3'>
        <h1 className='text-2xl font-semibold'>{userData?.user?.name}</h1>
        <h2 className='text-xl text-custom_grey font-light'>{userData?.user?.login}</h2>
      </div>

      <div className='mb-3'>
        <button className='bg-navbar_background w-full border border-custom_border_grey rounded-md px-4 py-1 font-semibold cursor-pointer hover:bg-button_hover'>Follow</button>
      </div>

      <p className='mb-3 text-base'>{userData?.user?.bio}</p>

      <div className='mb-3 flex items-center gap-2'>
        <FontAwesomeIcon icon={faUsers} />
        <p className='flex gap-1'>
          <span className='font-semibold'>{userData?.user?.followers?.totalCount}</span>
          <span className='text-custom_grey'>followers</span>
          <span>·</span>
          <span className='font-semibold'>{userData?.user?.following?.totalCount}</span>
          <span className='text-custom_grey'>following</span>
        </p>
      </div>

      <ul className='[&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li]:mb-2'>
        <li>
          <FontAwesomeIcon icon={faBuilding} />
          <span>{userData?.user?.company}</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faLocationDot} />
          <span>{userData?.user?.location}</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faEnvelope} />
          <span>{userData?.user?.email}</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faLink} />
          <span>{userData?.user?.websiteUrl}</span>
        </li>
      </ul>

    </div>
  )
}

export default LeftBar