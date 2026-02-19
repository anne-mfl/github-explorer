import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { getRelativeTime } from '@/utils/formatDate';

interface RepoMetaProps {
  primaryLanguage: { name: string; color: string | null } | null;
  stargazerCount: number;
  forkCount: number;
  licenseInfo: { name: string } | null;
  pushedAt: string | null;
  url: string;
  showLicense?: boolean;
}

const RepoMeta = ({ primaryLanguage, stargazerCount, forkCount, licenseInfo, pushedAt, url, showLicense = true }: RepoMetaProps) => {
  return (
    <div className='text-xs flex items-center mt-2 [&>span:not(:last-child)]:mr-4 [&>span]:whitespace-nowrap max-lg:flex-wrap'>
      {primaryLanguage &&
        <span className='flex items-center gap-1 mr-4'>
          <span style={{ backgroundColor: primaryLanguage.color ?? '#ccc' }} className='h-3 w-3 rounded-full'>&nbsp;</span>
          {primaryLanguage.name}
        </span>
      }
      {stargazerCount > 0 &&
        <span className='hover:text-custom_blue'>
          <Link href={`${url}/stargazers`}>
            <FontAwesomeIcon icon={faStar} className='mr-1' />
            {stargazerCount.toLocaleString()}
          </Link>
        </span>
      }
      {forkCount > 0 &&
        <span className='hover:text-custom_blue'>
          <Link href={`${url}/forks`}>
            <FontAwesomeIcon icon={faCodeFork} className='mr-1' />
            {forkCount.toLocaleString()}
          </Link>
        </span>
      }
      {showLicense && licenseInfo &&
        <span>
          <FontAwesomeIcon icon={faScaleBalanced} className='mr-1' />
          {licenseInfo.name}
        </span>
      }
      {pushedAt &&
        <span>
          Updated {getRelativeTime(pushedAt)}
        </span>
      }
    </div>
  );
};

export default RepoMeta;