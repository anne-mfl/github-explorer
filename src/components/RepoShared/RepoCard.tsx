import Link from 'next/link';
import RepoMeta from './RepoMeta';

interface RepoCardProps {
  repo: {
    id: string;
    name: string;
    url: string;
    description: string | null;
    isPrivate?: boolean;
    isFork?: boolean;
    pushedAt: string | null;
    stargazerCount: number;
    forkCount: number;
    primaryLanguage: { name: string; color: string | null } | null;
    licenseInfo: { name: string } | null;
    parent?: { url: string; nameWithOwner: string } | null;
    owner?: { login: string };
  };
  topics?: React.ReactNode;
  actions?: React.ReactNode; // Repositories passes <RepoSparkline />, Stars passes <StarButton />
  showLicense?: boolean;
}

const RepoCard = ({ repo, topics, actions, showLicense = true }: RepoCardProps) => {

  return (
    <li className='py-6 border-b border-custom_light_grey flex justify-between items-center'>
      <section>
        <div className='mb-1 flex items-center gap-2'>
          <Link href={repo.url} className='link_button text-xl'>
            {repo.owner ? (
              <>{repo.owner.login} / <b>{repo.name}</b></>
            ) : (
              <>{repo.name}</>
            )}
          </Link>          {repo.isPrivate !== undefined && (
            <span className='private_public_badge'>
              {repo.isPrivate ? 'Private' : 'Public'}
            </span>
          )}
        </div>

        {repo.isFork && repo.parent && (
          <p className='text-xs mb-1'>
            Forked from
            <Link href={repo.parent.url} className='link_secondary underline ml-1'>
              {repo.parent.nameWithOwner}
            </Link>
          </p>
        )}

        <p className='mb-4 pr-5'>{repo.description}</p>

        {topics}

        <RepoMeta
          primaryLanguage={repo.primaryLanguage}
          stargazerCount={repo.stargazerCount}
          forkCount={repo.forkCount}
          licenseInfo={repo.licenseInfo}
          pushedAt={repo.pushedAt}
          url={repo.url}
          showLicense={showLicense}
        />
      </section>

      {actions && (
        <section className='ml-16 shrink-0'>
          {actions}
        </section>
      )}
    </li>
  );
};

export default RepoCard;