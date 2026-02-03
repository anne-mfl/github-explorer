import Link from 'next/link';
import RepoTopics from './RepoTopics';
import RepoMeta from './RepoMeta';
import RepoSparkline from './RepoSparkline';

interface RepoCardProps {
  repo: {
    id: string;
    name: string;
    url: string;
    description: string | null;
    isPrivate: boolean;
    isFork: boolean;
    pushedAt: string | null;
    stargazerCount: number;
    forkCount: number;
    primaryLanguage: { name: string; color: string | null } | null;
    licenseInfo: { name: string } | null;
    parent: { url: string; nameWithOwner: string } | null;
    repositoryTopics: { nodes: { topic: { name: string } }[] };
  };
  sparklineData: number[];
}

const RepoCard = ({ repo, sparklineData }: RepoCardProps) => {
  return (
    <li className='py-6 border-b border-custom_light_grey flex justify-between'>
      <section>
        <div className='mb-1 flex items-center'>
          <Link href={repo.url} className='link_button text-xl'>{repo.name}</Link>
          <div className='mb-0.5'>
            <span className='private_public_badge mb-1'>
              {repo.isPrivate ? 'Private' : 'Public'}
            </span>
          </div>
        </div>

        {repo.isFork && repo.parent &&
          <p className='text-xs mb-1'>
            Forked from
            <Link href={repo.parent.url} className='link_secondary underline ml-1'>
              {repo.parent.nameWithOwner}
            </Link>
          </p>
        }

        <p className='mb-4 pr-5'>{repo.description}</p>

        <RepoTopics topics={repo.repositoryTopics.nodes} />

        <RepoMeta
          primaryLanguage={repo.primaryLanguage}
          stargazerCount={repo.stargazerCount}
          forkCount={repo.forkCount}
          licenseInfo={repo.licenseInfo}
          pushedAt={repo.pushedAt}
          url={repo.url}
        />
      </section>

      <RepoSparkline data={sparklineData} />
    </li>
  );
};

export default RepoCard;