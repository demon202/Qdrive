import React from 'react';
import Image from 'next/image';

const layout = ({children} : { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen'>
        <section className="relative hidden w-2/5 items-center justify-center p-10 lg:flex xl:2/5">
  {/* Background image with opacity */}
  <div
    className="absolute inset-0 h-7/5 w-5/5 bg-cover bg-center opacity-20 "
    style={{ backgroundImage: "url('/assets/images/drive-bg.png')" }}
  />
 {/* Content above background */}
  <div className="relative flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
                <Image 
                src="/assets/icons/logo.png"
                width={224}
                height={82}
                className='h-auto transition-all hover:rotate-2 hover:scale-105'
                alt="logo"
                />

                <div className='space-y-5 text-white'>
                    <h1 className='h1'> Back It Up. Stack It Up. Hoard It All!</h1>
                    <p className='body-1'>
                        A place where you can store anything.
                    </p>

                </div>
            <Image
                src="/assets/images/illustration.png"
                alt="Files"
                width={342} 
                height={342}
                className='transition-all hover:rotate-2 hover:scale-105'
                />
                
            </div>     
        </section>

        <section className='flex flex-1 flex-col items-center bg-black p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
            <div className='mb-16 lg:hidden'>
                <Image 
                src="/assets/icons/logo.png"
                alt='logo'
                width={224}
                height={82}
                className='h-auto w-[200px] lg:w-[250px]'
                />
            </div>
            {children}
        </section>
        </div>
  )
}

export default layout