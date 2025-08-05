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

      <ul className='[&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li>a]:flex [&>li>a]:items-center [&>li>a]:gap-2 [&>li]:mb-2 [&>li>a]:hover:underline [&>li>a>span]:hover:text-custom_blue cursor-pointer'>
        {userData?.user?.company &&
          <li>
            <FontAwesomeIcon icon={faBuilding} />
            <span>{userData?.user?.company}</span>
          </li>
        }
        {userData?.user?.location &&
          <li>
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{userData?.user?.location}</span>
          </li>
        }
        {userData?.user?.email &&
          <li>
            <Link href={`mailto:${userData?.user?.email}`}>
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{userData?.user?.email}</span>
            </Link>
          </li>
        }
        {userData?.user?.websiteUrl &&
          <li>
            <Link href={userData?.user?.websiteUrl}>
              <FontAwesomeIcon icon={faLink} />
              <span>{userData?.user?.websiteUrl}</span>
            </Link>
          </li>
        }
      </ul>

      {userData?.user.organizations.nodes.length > 0 &&
        <div className='border-t border-custom_border_grey my-4 py-4'>
          <h3 className='text-base mb-2 font-semibold'>Organizations</h3>
          <div className='flex flex-wrap gap-0.5'>
            {userData?.user.organizations.nodes.map((organization) => {
              // console.log(organization)
              return <Link key={organization.id} href={`https://github.com/${organization.login}`}>
                <Image
                  src={organization.avatarUrl}
                  className='border border-custom_light_grey rounded-md'
                  alt={`${organization.login}'s avatar`}
                  width={32}
                  height={32}
                />
              </Link>
            })}
          </div>
        </div>
      }

    </div>
  )
}

export default LeftBar