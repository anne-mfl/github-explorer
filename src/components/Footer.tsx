import Image from 'next/image'
import Link from 'next/link'
import GitHubLogo from 'assets/mark.png'



const Footer = () => {
  return (
    <footer className='w-svw bottom-0 text-center pt-12 pb-10 px-4 flex flex-col lg:flex-row justify-center items-center text-xs text-custom_grey leading-5'>

      <div className='flex items-center mx-2 order-last lg:order-first'>
        <Link href='https://github.com' target='_blank' className='mr-2'>
          <Image
            src={GitHubLogo}
            alt='GitHub Logo'
            width={24}
            height={24}
          />
        </Link>
        <p className='whitespace-nowrap'>
          &copy; {new Date().getFullYear()} GitHub, Inc.
        </p>
      </div>

      <ul className='flex flex-wrap justify-center [&_li]:mx-2'>
        <Link href='https://docs.github.com/site-policy/github-terms/github-terms-of-service' target='_blank'>
          <li className='link_secondary'>Terms</li>
        </Link>
        <Link href='https://docs.github.com/site-policy/privacy-policies/github-privacy-statement' target='_blank'>
          <li className='link_secondary'>Privacy</li>
        </Link>
        <Link href='https://github.com/security' target='_blank'>
          <li className='link_secondary'>Security</li>
        </Link>
        <Link href='https://www.githubstatus.com/' target='_blank'>
          <li className='link_secondary'>Status</li>
        </Link>
        <Link href='https://github.community/' target='_blank'>
          <li className='link_secondary'>Community</li>
        </Link>
        <Link href='https://docs.github.com/' target='_blank'>
          <li className='link_secondary'>Docs</li>
        </Link>
        <Link href='https://support.github.com/?tags=dotcom-footer' target='_blank'>
          <li className='link_secondary'>Contact</li>
        </Link>
        <li className='link_secondary whitespace-nowrap'>Manage cookies</li>
      </ul>

      <span className='link_secondary whitespace-nowrap mx-2 max-lg:mb-2'>Do not share my personal information</span>

    </footer>
  )
}

export default Footer