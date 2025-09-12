import React from 'react'
import Image from "next/image"
import { Button } from './ui/button'
import FileUploader from './FileUploader'
import Search from './Search'
import { signOutUser } from '@/lib/actions/user.actions'

const Header = ({userId,accountID} : {userId: string; accountID:string}) => {
  return (
    <header className='header'>
        <Search></Search>
        <div className='header-wrapper'>
            <FileUploader ownerId={userId} accountId={accountID}></FileUploader>
            <form action={async() => {
              'use server';

              await signOutUser();
            }}>
                <Button type = 'submit' className='sign-out-button'>
                    <Image
                    src='/assets/icons/logout.svg'
                    alt='LogOut'
                    width={24}
                    height={24}
                    className='w-6'/>
                </Button>
            </form>
        </div>
    </header>
  )
}

export default Header