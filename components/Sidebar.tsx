import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { avatarPlaceholderUrl, navItems } from '@/app/constants'
import { getTotalSpaceUsed } from '@/lib/actions/file.actions'
import {Chart} from '@/components/Chart'
import SidebarNav from './SidebarNav' 
import UserInfo from './UserInfo'

interface Props {
    fullName: string;
    avatar: string;
    email: string;
}

const Sidebar = async ({fullName, avatar, email}: Props) => {
    // Fetch total space used on the server
    const totalSpace = await getTotalSpaceUsed();

    return (
        <aside className='sidebar'>
            <Link href='/' className="flex items-center gap-3">
                <Image
                    src="/assets/icons/Logo.svg"
                    alt='Logo'
                    width={100}
                    height={45}
                    className='hidden h-auto lg:block'
                />
                <span className='logo-text hidden lg:inline'>Qdrive</span>
                <Image
                    src='/assets/icons/Logo.svg'
                    alt='Logo'
                    width={52}
                    height={52}
                    className='lg:hidden'
                />
            </Link>

            {/* Client component handles pathname */}
            <SidebarNav navItems={navItems} />
            

            {/* Chart total space */}
            <div className=''>
                <Chart used={totalSpace.used} />
            </div>
        </aside>
    )
}

export default Sidebar

