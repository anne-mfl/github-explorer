// "use client"

// import Image from 'next/image'
// import GitHubLogo from 'assets/mark.png'
// import Search from 'components/Search'
// import Link from 'next/link'
// import { useParams } from 'next/navigation'

// const Navbar = () => {

//   const params = useParams()
//   const userId = params.userId as string;

//   return (
//     <nav className='flex items-center justify-between h-16 px-4 pt-4 pb-2 bg-navbar_background  z-30 w-full max-sm:pr-0'>
//       <div className='flex items-center gap-2'>
//         <Link href="/">
//           <Image
//             src={GitHubLogo}
//             alt="GitHub Logo"
//             width={32}
//             height={32}
//           />
//         </Link>
//         <Link href={`/${userId}`} className='py-1 px-1.5 font-semibold primary_button'>
//           {userId}
//         </Link>
//       </div>

//       <Search isInNavbar={true} />
//     </nav>
//   )
// }

// export default Navbar


"use client"

import Image from 'next/image'
import GitHubLogo from 'assets/mark.png'
import Search from 'components/Search'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const Navbar = () => {

  const params = useParams()
  const userId = params.userId as string;

  return (
    <nav className='flex items-center justify-between gap-4 h-16 px-4 pt-4 pb-2 bg-navbar_background z-30 w-full max-sm:pr-0'>
      <div className='flex items-center gap-2 flex-shrink-0'>
        <Link href="/">
          <Image
            src={GitHubLogo}
            alt="GitHub Logo"
            width={32}
            height={32}
          />
        </Link>
        <Link href={`/${userId}`} className='py-1 px-1.5 font-semibold primary_button whitespace-nowrap'>
          {userId}
        </Link>
      </div>

      <div className='flex-1 max-sm:flex-1 sm:flex-initial max-w-2xl'>
        <Search isInNavbar={true} />
      </div>
    </nav>
  )
}

export default Navbar