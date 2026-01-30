import Image from 'next/image'
import Link from 'next/link'
import GitHubLogo from 'assets/mark.png'



const Footer = () => {
  return (
    <footer className='w-svw bottom-0 text-center pt-12 pb-10 px-4 flex justify-center items-center text-xs text-custom_grey'>
      <div className='flex items-center mx-2'>
        <Link href='https://github.com' target='_blank' className='mr-2'>
          <Image
            src={GitHubLogo}
            alt='GitHub Logo'
            width={24}
            height={24}
            className=''
          />
        </Link>
        <p className=''>
          &copy; {new Date().getFullYear()} GitHub, Inc.
        </p>
      </div>
      <ul className='flex [&_li]:mx-2'>
        <Link href='https://docs.github.com/site-policy/github-terms/github-terms-of-service' target='_blank'>
          <li className='hover:underline hover:text-custom_blue'>Terms</li>
        </Link>
        <Link href='https://docs.github.com/site-policy/privacy-policies/github-privacy-statement' target='_blank'>
          <li className='hover:underline hover:text-custom_blue'>Privacy</li>
        </Link>
        <Link href='https://github.com/security' target='_blank'>
          <li className='hover:underline hover:text-custom_blue'>Security</li>
        </Link>
        <Link href='https://www.githubstatus.com/' target='_blank'>
          <li className='hover:underline hover:text-custom_blue'>Status</li>
        </Link>
        <Link href='https://github.community/' target='_blank'>
          <li className='hover:underline hover:text-custom_blue'>Community</li>
        </Link>
        <Link href='https://docs.github.com/' target='_blank'>
          <li className='hover:underline hover:text-custom_blue'>Docs</li>
        </Link>
        <Link href='https://support.github.com/?tags=dotcom-footer' target='_blank'>
          <li className='hover:underline hover:text-custom_blue'>Contact</li>
        </Link>
        <li>Manage cookies</li>
        <li>Do not share my personal information</li>
      </ul>
    </footer>
  )
}

export default Footer