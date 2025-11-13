'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BackgroundAnimation from '../constants/BackgroundAnimation';

const Layout = ({children} : { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px for lg breakpoint
    };

    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className='relative flex min-h-screen'>
        {/* Conditionally render background based on device */}
        {isMobile ? (
          <div className='fixed inset-0 -z-10'>
            <Image
              src="/assets/images/Background_Mobile.png"
              alt="Background"
              fill
              className='object-cover object-center'
              priority
              quality={90}
            />
          </div>
        ) : (
          <BackgroundAnimation />
        )}
        
        <section className="relative hidden w-2/5 items-center justify-center p-10 lg:flex xl:2/5">
            {/* Background image with opacity */}
            {/*<div
                className="absolute inset-0 h-7/5 w-5/5 bg-cover bg-center opacity-20 "
                style={{ backgroundImage: "url('/assets/images/drive-bg.png')" }}
            />*/}

            {/* Content above background */}
            <div className="relative z-10 flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
                <div className='w-[360px] h-[294px] flex-col items-center justify-center text-white '>
                    <h1 className=' leading-20 font-style: font-semibold text-[62px] '> Back It Up, Stack It Up, <span className="font-style: font-black text-[58px]">Hoard It All!</span></h1>
                    <p className="mt-7.5 text-[20px] font-semibold text-[#838383] ">
                        A place where you can store anything.
                    </p>
                </div>
            </div>     
        </section>

        <section className='relative z-10 flex flex-1 flex-col items-center p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
            <div className='mb-16 lg:hidden'>
                <Image 
                    src="/assets/icons/Logo.svg"
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

export default Layout