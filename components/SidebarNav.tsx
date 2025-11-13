// ============================================
// Create SidebarNav.tsx (Client Component)
// ============================================

'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
    url: string;
    name: string;
    icon: string;
}

interface Props {
    navItems: NavItem[];
}

const SidebarNav = ({ navItems }: Props) => {
    const pathName = usePathname();

    return (
        <nav className='sidebar-nav'>
            <ul className='flex flex-1 flex-col gap-6'>
                {navItems.map(({url, name, icon}) => (
                    <Link key={name} href={url} className='lg:w-full'>
                        <li className={cn("sidebar-nav-item", (pathName === url) && 'shad-active')}>
                            <Image
                                src={icon}
                                alt={name}
                                width={24}
                                height={24}
                                className={cn('nav-icon', (pathName === url) && "nav-icon-active")}
                            />
                            <p className='hidden lg:block'>{name}</p>
                        </li>
                    </Link>
                ))}
            </ul>
        </nav>
    )
}

export default SidebarNav