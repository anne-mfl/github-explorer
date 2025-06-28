'use client'
import { useLazyQuery } from '@apollo/client';
import { GET_USERS } from './queries';

import { useState } from 'react'

const Navbar = () => {

  const [userNameInputValue, setUserNameInputValue] = useState<string>('');

  const [getUsers, {data, loading, error}] = useLazyQuery(GET_USERS, {
    variables: {
      userQuery: userNameInputValue,
    },
  })

  console.log('data', data);

  return (
    <nav>
      <input
        type='text'
        value={userNameInputValue}
        onChange={(e) => {
          setUserNameInputValue(e.target.value)
          getUsers()
        }}
        placeholder='Search GitHub Users'
        className='p-2 border rounded'
      />
    </nav>
  )
}

export default Navbar