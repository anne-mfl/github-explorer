import Repositories from './components/Repositories';
import Contributions from './components/Contributions';

const Overview = () => {
  return (
    <>
      <Repositories />
      <div className='h-8'></div>
      <Contributions />
    </>
  )
}

export default Overview