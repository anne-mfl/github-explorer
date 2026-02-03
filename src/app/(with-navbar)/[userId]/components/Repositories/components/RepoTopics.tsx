import Link from 'next/link';

interface RepoTopicsProps {
  topics: { topic: { name: string } }[];
}

const RepoTopics = ({ topics }: RepoTopicsProps) => {
  if (!topics || topics.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-1 mb-3'>
      {topics.map((topicNode) => (
        <Link key={topicNode.topic.name} href={`https://github.com/topics/${topicNode.topic.name}`}>
          <span className='bg-custom_light_blue text-custom_blue px-2 py-1 rounded-full text-xs hover:bg-custom_blue hover:text-white'>
            {topicNode.topic.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default RepoTopics;