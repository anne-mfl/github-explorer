import { Sparklines, SparklinesLine } from 'react-sparklines';
import StarButton from '@/components/RepoShared/StarButton';

interface RepoSparklineProps {
  data: number[];
}

const RepoSparkline = ({ data }: RepoSparklineProps) => {
  return (
    <section className=''>
      <StarButton />
      <div className='flex items-center mt-2 max-lg:hidden'>
        <Sparklines data={data} width={150} height={24} margin={2}>
          <SparklinesLine color="#3fb950" style={{ fill: "none", strokeWidth: 2 }} />
        </Sparklines>
      </div>
    </section>
  );
};

export default RepoSparkline;