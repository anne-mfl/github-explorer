import React from 'react'
import Image from 'next/image'
import mark from 'assets/mark.png'
import Search from 'components/Search'

const Navbar = () => {
  return (
    // <nav className='flex items-center'>
    //   <Image
    //     src={mark}
    //     alt="GitHub Explorer Logo"
    //     width={40}
    //     height={40}
    //   />
    //   Navbar
    //   <Search />
    // </nav>
    <nav className='flex items-center justify-between h-16 px-4 py-2 bg-navbar_background border-b border-custom_light_grey sticky top-0 z-30'>
      <div className='flex items-center gap-2'>
        <Image
          src={mark}
          alt="GitHub Explorer Logo"
          width={40}
          height={40}
        />
        <span className='text-xl font-medium'>GitHub Explorer</span>
      </div>

      <Search isInNavbar={true} />
    </nav>
  )
}

export default Navbar