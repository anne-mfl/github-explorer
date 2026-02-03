import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const RepoSearchBar = () => {
  return (
    <div className='flex py-4 border-b border-custom_light_grey'>
      <input
        type='text'
        placeholder='Find a repository...'
        className='h-8 border border-custom_light_grey rounded-lg w-96 pl-4 pr-10 mr-2'
      />
      <div className='flex gap-2 [&>button]:flex [&>button]:items-center'>
        <button className='grey_button'>
          Type <FontAwesomeIcon icon={faCaretDown} className='ml-1' />
        </button>
        <button className='grey_button'>
          Language <FontAwesomeIcon icon={faCaretDown} className='ml-1' />
        </button>
        <button className='grey_button'>
          Sort <FontAwesomeIcon icon={faCaretDown} className='ml-1' />
        </button>
      </div>
    </div>
  );
};

export default RepoSearchBar;