"use client"

import Image from 'next/image'
import mark from 'assets/mark.png'
import Search from 'components/Search'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const Navbar = () => {

  const params = useParams()
  const userId = params.userId as string;

  return (
    <nav className='flex items-center justify-between h-16 px-4 pt-4 pb-2 bg-navbar_background  sticky top-0 z-30 w-full'>
      <div className='flex items-center gap-2'>
        <Link href="/">
          <Image
            src={mark}
            alt="GitHub Explorer Logo"
            width={32}
            height={32}
          />
        </Link>
        <Link href={`/user/${userId}`} className='py-1 px-1.5 font-semibold primary_button'>
          {userId}
        </Link>
      </div>

      <Search isInNavbar={true} />
    </nav>
  )
}

export default Navbar