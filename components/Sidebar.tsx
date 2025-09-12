'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { avatarPlaceholderUrl, navItems } from '@/app/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
    fullName: String;
    avatar: String;
    email: String;
}
const Sidebar = ({fullName, avatar, email}:Props) => {

    const pathName = usePathname();
  return (
    <aside className='sidebar'>
        <Link href = '/'>
        <Image
        src="/assets/icons/logo.png"
        alt='Logo'
        width={160}
        height={50}
        className='hidden h-auto lg:block'
        />
        <Image
        src='/assets/icons/logo.png'
        alt='Logo'
        width={52}
        height={52}
        className='lg:hidden'
        />
        </Link>

        <nav className='sidebar-nav'>
            <ul className='flex flex-1 flex-col gap-6'>
                {navItems.map(({url,name,icon}) => {
                    return <Link key={name} href={url} className='lg:w-full'>
                        <li className={cn("sidebar-nav-item", (pathName === url) && 'shad-active')}>
                            <Image
                            src={icon}
                            alt={name}
                            width={24}
                            height={24}
                            className={cn('nav-icon', (pathName===url) && "nav-icon-active")}
                            />
                            <p className='hidden lg:block'>{name}</p>
                        </li>
                    
                    </Link>
                })}

            </ul>
        </nav>
        
        <Image
        src='/assets/images/illustration.png'
        alt='logo'
        width={160}
        height={160}
        className=''
        />

        <div className='sidebar-user-info'>
             <Image
                src= {avatarPlaceholderUrl}
                alt='avatar'
                width={44}
                height={44}
                className='sidebar-user-avatar'
            />
            <div className='hidden lg:block'>
                <p className='subtitle-2 capitalize'>{fullName}</p>
                <p className='caption'>{email}</p>
            </div>
        </div>
    </aside>
  )
}

export default Sidebar