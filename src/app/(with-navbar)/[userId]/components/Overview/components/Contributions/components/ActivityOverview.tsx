import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faBookBookmark, faTableColumns, faCube, faStar } from '@fortawesome/free-solid-svg-icons'


const ActivityOverview = () => {
  return (
    <div className='border-r border-custom_border_grey pr-8 grow'>
      <h2 className='mb-4'>ActivityOverview</h2>
      <div className='flex '>
        <FontAwesomeIcon icon={faBookBookmark} className='mt-1 mr-2'/>
        <p>
          Contributed to Contributed to Contributed to Contributed to Contributed to Contributed to Contributed to Contributed to
        </p>
      </div>
    </div>
  )
}

export default ActivityOverview