import React from 'react'
import { useGithubContext } from 'context/GithubContext';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope, faLink, faBuilding, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Loading from '@/components/Loading';
import { formatNumber } from '@/utils/formatNumber';

const ProfileSideBar = () => {

  const { userData } = useGithubContext();

  if (!userData) {
    return <Loading />;
  }

  type Organization = typeof userData.user.organizations.nodes[number];

  return (
    <div className=''>
      <div className='max-md:flex max-md:items-center max-md:gap-4 max-md:mb-5'>
        <div className='relative w-full h-full aspect-square max-md:max-h-30.5 max-md:min-h-21.5 max-md:max-w-30.5 max-md:min-w-21.5'>
          <Image
            src={userData?.user?.avatarUrl}
            alt={`${userData?.user?.name || userData?.user?.login}'s avatar`}
            fill
            className='rounded-full mb-4 object-cover border-2 border-custom_light_grey max-md:mb-0'
          />
        </div>

        <div className='py-3 whitespace-nowrap'>
          <h1 className='text-2xl font-semibold'>{userData?.user?.name}</h1>
          <h2 className='text-xl text-custom_grey font-light'>{userData?.user?.login}</h2>
        </div>
      </div>

      <div className='flex flex-col border-b border-custom_light_grey py-2'>

        <div className='mb-3 order-1 max-md:order-4'>
          <button className='grey_button w-full'>Follow</button>
        </div>

        <p className='mb-3 text-base order-2 max-md:order-1'>{userData?.user?.bio}</p>

        <div className='mb-3 flex items-center gap-2 order-3'>
          <FontAwesomeIcon icon={faUsers} />
          <p className='flex gap-1'>
            <span className='font-semibold'>{formatNumber(userData?.user?.followers?.totalCount)}</span>
            <span className='text-custom_grey'>followers</span>
            <span>·</span>
            <span className='font-semibold'>{formatNumber(userData?.user?.following?.totalCount)}</span>
            <span className='text-custom_grey'>following</span>
          </p>
        </div>

        <ul className='[&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li>a]:flex [&>li>a]:items-center [&>li>a]:gap-2 [&>li]:mb-2 [&>li>a>span]:hover:underline [&>li>a>span]:hover:text-custom_blue cursor-pointer order-4 max-md:order-2'>
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
      </div>

      {userData?.user.organizations.nodes.length > 0 &&
        <div className='py-4 max-md:hidden'>
          <h3 className='text-base mb-2 font-semibold'>Organizations</h3>
          <div className='flex flex-wrap gap-0.5'>
            {userData?.user.organizations.nodes.map((organization: Organization) => {
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

export default ProfileSideBar


// const ProfileSideBar = () => {
//   const { userData } = useGithubContext();

//   if (!userData) {
//     return <Loading />;
//   }

//   type Organization = typeof userData.user.organizations.nodes[number];

//   return (
//     <div className=''>
//       <div className='max-md:flex max-md:items-center max-md:gap-4 max-md:mb-5'>
//         <div className='relative w-full h-full aspect-square max-md:max-h-30.5 max-md:min-h-21.5 max-md:max-w-30.5 max-md:min-w-21.5'>
//           <Image
//             src={userData?.user?.avatarUrl}
//             alt={`${userData?.user?.name || userData?.user?.login}'s avatar`}
//             fill
//             className='rounded-full mb-4 object-cover border-2 border-custom_light_grey max-md:mb-0'
//           />
//         </div>

//         <div className='py-3 whitespace-nowrap'>
//           <h1 className='text-2xl font-semibold'>{userData?.user?.name}</h1>
//           <h2 className='text-xl text-custom_grey font-light'>{userData?.user?.login}</h2>
//         </div>
//       </div>

//       {/* Flex container for reorderable sections */}
//       <div className='flex flex-col'>
//         {/* Bio - order 1 on mobile, order 2 on desktop */}
//         <p className='mb-3 text-base order-2 max-md:order-1'>
//           {userData?.user?.bio}
//         </p>

//         {/* Follow button - order 2 on mobile, order 1 on desktop */}
//         <div className='mb-3 order-1 max-md:order-2'>
//           <button className='grey_button w-full'>Follow</button>
//         </div>

//         {/* Followers/Following - order 3 on both */}
//         <div className='mb-3 flex items-center gap-2 order-3'>
//           <FontAwesomeIcon icon={faUsers} />
//           <p className='flex gap-1'>
//             <span className='font-semibold'>{userData?.user?.followers?.totalCount}</span>
//             <span className='text-custom_grey'>followers</span>
//             <span>·</span>
//             <span className='font-semibold'>{userData?.user?.following?.totalCount}</span>
//             <span className='text-custom_grey'>following</span>
//           </p>
//         </div>

//         {/* Social links - order 4 on both */}
//         <ul className='[&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li>a]:flex [&>li>a]:items-center [&>li>a]:gap-2 [&>li]:mb-2 [&>li>a>span]:hover:underline [&>li>a>span]:hover:text-custom_blue cursor-pointer order-4'>
//           {userData?.user?.company &&
//             <li>
//               <FontAwesomeIcon icon={faBuilding} />
//               <span>{userData?.user?.company}</span>
//             </li>
//           }
//           {userData?.user?.location &&
//             <li>
//               <FontAwesomeIcon icon={faLocationDot} />
//               <span>{userData?.user?.location}</span>
//             </li>
//           }
//           {userData?.user?.email &&
//             <li>
//               <Link href={`mailto:${userData?.user?.email}`}>
//                 <FontAwesomeIcon icon={faEnvelope} />
//                 <span>{userData?.user?.email}</span>
//               </Link>
//             </li>
//           }
//           {userData?.user?.websiteUrl &&
//             <li>
//               <Link href={userData?.user?.websiteUrl}>
//                 <FontAwesomeIcon icon={faLink} />
//                 <span>{userData?.user?.websiteUrl}</span>
//               </Link>
//             </li>
//           }
//         </ul>

//         {/* Organizations - order 5 on both */}
//         {userData?.user.organizations.nodes.length > 0 &&
//           <div className='border-t border-custom_border_grey my-4 py-4 order-5'>
//             <h3 className='text-base mb-2 font-semibold'>Organizations</h3>
//             <div className='flex flex-wrap gap-0.5'>
//               {userData?.user.organizations.nodes.map((organization: Organization) => {
//                 return <Link key={organization.id} href={`https://github.com/${organization.login}`}>
//                   <Image
//                     src={organization.avatarUrl}
//                     className='border border-custom_light_grey rounded-md'
//                     alt={`${organization.login}'s avatar`}
//                     width={32}
//                     height={32}
//                   />
//                 </Link>
//               })}
//             </div>
//           </div>
//         }
//       </div>
//     </div>
//   )
// }

// export default ProfileSideBar