import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"
import React from 'react'

export const dynamic = 'force-dynamic';

const layout = async ({children}: {children:React.ReactNode}) => {

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return redirect('/sign-in');
    }

  return (
    <main className='flex h-screen'> 
      <Sidebar {...currentUser}/>

      <section className='flex h-full flex-1 flex-col'>
        <MobileNavigation {...currentUser}/>
        <Header 
          userId={currentUser.$id} 
          accountID={currentUser.accountId} 
          fullName={currentUser.fullName} 
          email={currentUser.email} 
          avatar={currentUser.avatar}
        />

        <div className='main-content overflow-y-auto max-h-[calc(100vh-120px)]'>{children}</div>
      </section>
      <Toaster />
    </main>
  )
}

export default layout