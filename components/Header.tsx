import React from 'react'
import Image from "next/image"
import { Button } from './ui/button'
import FileUploader from './FileUploader'
import Search from './Search'
import { signOutUser } from '@/lib/actions/user.actions'
import { avatarPlaceholderUrl } from '@/app/constants'
import UserInfo from './UserInfo';
import { Chart } from './Chart'
import { getTotalSpaceUsed } from '@/lib/actions/file.actions'

interface HeaderProps {
  userId: string;
  accountID: string;
  fullName: string;
  avatar: string;
  email: string;
}

const Header = async ({ userId, accountID, fullName, avatar, email }: HeaderProps) => {
  const totalSpace = await getTotalSpaceUsed();

  return (
    <header className='header flex-col'>
      {/* Top row - Hidden on mobile, visible on larger screens */}
      <div className='hidden sm:flex items-end justify-end gap-5 w-full'>
        <UserInfo fullName={fullName} email={email} avatar={avatar} />
        <Search />
        <div className='hidden header-wrapper md:flex'>
          <FileUploader ownerId={userId} accountId={accountID} />
          <form action={async() => {
            'use server';
            await signOutUser();
          }}>
          </form>
        </div>
      </div>

      {/* Chart - Full width on mobile, also visible on larger screens */}
      <div className="w-full mt-4 sm:hidden justify-items-center">
        <Chart used={totalSpace?.used || 0} />
      </div>
    </header>
  )
}

export default Header