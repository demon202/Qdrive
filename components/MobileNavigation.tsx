"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { navItems } from "@/app/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";
import Search from './Search'

interface Props {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  return (
    <div className="block sm:hidden">
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-bg-Dark px-4 py-3">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/assets/icons/Logo.svg"
          alt="logo"
          width={42}
          height={40}
          className="h-[40px] w-[42px]"
        />
      </div>

      {/* Search Bar */}
      <div className="flex-1 px-3">
        <div className="relative flex items-center w-full h-[46px] rounded-full bg-dark-300/30 backdrop-blur-md px-4">
          <Search />
        </div>
      </div>

      {/* Menu Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[41px] bg-dark-300/40 backdrop-blur-md">
            <Image
              src="/assets/icons/menu.svg"
              alt="menu"
              width={24}
              height={24}
              className="opacity-80"
            />
          </div>
        </SheetTrigger>

        <SheetContent className="shad-sheet h-screen scroll-px-3">
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
             <Button
              type="button"
              className="sign-out-button flex items-end justify-items-end rounded-full bg-dark-300/30 backdrop-blur-md hover:bg-dark-300/50 transition-all duration-200 ml-auto md:ml-0"
              onClick={async () => await signOutUser()}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="LogOut"
                width={25}
                height={25}
                className="w-[25px] h-[25px] opacity-80"
              />
            </Button>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>

          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ url, name, icon }) => (
                <Link key={name} href={url} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathName === url && "shad-active"
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        pathName === url && "nav-icon-active"
                      )}
                    />
                    <p className="lg:block">{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <Separator className="my-2 bg-light-200/20" />

          <div className="flex flex-col justify-between items-center gap-5 px-4 md:px-0 mb-4">
            <FileUploader ownerId={ownerId} accountID={accountId} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
    </div>
  );
};

export default MobileNavigation;
