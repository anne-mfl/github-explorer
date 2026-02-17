import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';

interface StarButtonProps {
  showSponsor?: boolean;
}

const StarButton = ({ showSponsor = false }: StarButtonProps) => {
  return (
    <div className='flex items-center gap-2'>
      {showSponsor && (
        <div className='flex h-6.5'>
          <button className='grey_button rounded-md font-normal text-xs flex items-center'>
            <FontAwesomeIcon icon={faHeart} className='mr-2 w-4 h-4 text-pink-500' />
            Sponsor
          </button>
        </div>
      )}
      <div className='flex h-6.5'>
        <button className='grey_button rounded-none rounded-l-md font-normal text-xs flex items-center'>
          <FontAwesomeIcon icon={faStar} className='mr-2 w-4 h-4' />
          Star
        </button>
        <button className='grey_button rounded-none rounded-r-md border-l-0'>
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </div>
    </div>
  );
};

export default StarButton;