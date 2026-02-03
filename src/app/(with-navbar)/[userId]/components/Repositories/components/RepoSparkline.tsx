import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { Sparklines, SparklinesLine } from 'react-sparklines';

interface RepoSparklineProps {
  data: number[];
}

const RepoSparkline = ({ data }: RepoSparklineProps) => {
  return (
    <section className='ml-16'>
      <div className='flex'>
        <button className='grey_button rounded-none rounded-l-md font-normal text-xs flex items-center'>
          <FontAwesomeIcon icon={faStar} className='mr-2 w-4 h-4' />
          Star
        </button>
        <button className='grey_button rounded-none rounded-r-md border-l-0'>
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </div>
      <div className='h-15 flex items-center'>
        <Sparklines data={data} width={150} height={24} margin={5}>
          <SparklinesLine color="#3fb950" style={{ fill: "none", strokeWidth: 2 }} />
        </Sparklines>
      </div>
    </section>
  );
};

export default RepoSparkline;