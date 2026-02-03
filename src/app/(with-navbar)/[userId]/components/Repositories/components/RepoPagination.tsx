import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface RepoPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  isLoading: boolean;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

const RepoPagination = ({ currentPage, hasNextPage, isLoading, totalCount, onPrevious, onNext }: RepoPaginationProps) => {
  if (totalCount <= 30) return null;

  return (
    <div className='flex items-center justify-center gap-2 py-6'>
      <button
        onClick={onPrevious}
        disabled={currentPage === 1 || isLoading}
        className={`border rounded border-transparent px-3 py-1 text-sm ${currentPage === 1
          ? 'text-custom_border_grey'
          : 'hover:border-custom_border_grey text-custom_blue cursor-pointer'
        }`}
      >
        <FontAwesomeIcon icon={faAngleLeft} className='mr-2' />
        Previous
      </button>

      <button
        onClick={onNext}
        disabled={!hasNextPage || isLoading}
        className={`border rounded border-transparent px-3 py-1 text-sm ${!hasNextPage
          ? 'text-custom_border_grey'
          : 'hover:border-custom_border_grey text-custom_blue cursor-pointer'
        }`}
      >
        Next
        <FontAwesomeIcon icon={faAngleRight} className='ml-2' />
      </button>
    </div>
  );
};

export default RepoPagination;