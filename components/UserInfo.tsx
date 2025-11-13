'use client';

import Image from "next/image";
import { avatarPlaceholderUrl } from "@/app/constants";

interface UserInfoProps {
  fullName?: string;
  email?: string;
  avatar?: string;
  showEmail?: boolean; 
}

export default function UserInfo({ fullName, email, avatar, showEmail = false }: UserInfoProps) {
  return (
    <div className="flex flex-1 items-center justify-left gap-3 px-4">
      <Image
        src={avatar || avatarPlaceholderUrl}
        alt="User avatar"
        width={44}
        height={44}
        className="rounded-full object-cover aspect-square"
      />

      <div className="hidden lg:block">
        
        <span className="capitalize header-user-info-title">Hi {fullName || "User"},</span>
        {showEmail && <span className="caption text-gray-400">{email || "No email"}</span>}
      </div>
    </div>
  );
}
