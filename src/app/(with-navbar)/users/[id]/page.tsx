import React from 'react'

interface UserPageProps {
  params: {
    id: string
  }
}


const Users = ({ params }: UserPageProps) => {
  const { id } = params

  return (
    <div>Users Profile: {id}</div>
  )
}

export default Users