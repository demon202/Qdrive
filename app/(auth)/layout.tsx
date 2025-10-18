import React from 'react';
import Image from 'next/image';
import BackgroundAnimation from '../constants/BackgroundAnimation';

const layout = ({children} : { children: React.ReactNode }) => {
  return (
    <div className='relative flex min-h-screen'>
        {/* Background Animation - behind everything */}
        <BackgroundAnimation />
        
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