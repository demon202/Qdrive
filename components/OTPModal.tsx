'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from './ui/button';
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions';

const OTPModal = ({ accountID, email }: { accountID: string; email: string }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const firstAttempt = useRef(true);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const sessionID = await verifySecret({
        accountId: accountID,
        password: password,
      });

      if (sessionID) {
        router.push('/');
      } else {
        triggerInvalidOTPFeedback();
      }
    } catch (error) {
      console.error('failed to verify OTP', error);
      triggerInvalidOTPFeedback();
    }
    setIsLoading(false);
  };

  const triggerInvalidOTPFeedback = () => {
    // shake animation
    setShake(true);
    setTimeout(() => setShake(false), 500);

    // toast feedback
    toast.error("Incorrect OTP", { duration: 2000 });

    // haptic feedback (mobile)
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(150);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    await sendEmailOTP({ email });
    setCooldown(30); // 30s cooldown
    toast.success("OTP resent");
  };

  // countdown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // auto-submit only first time
  useEffect(() => {
    if (firstAttempt.current && password.length === 6) {
      firstAttempt.current = false;
      handleSubmit();
    }
  }, [password]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              width={20}
              height={20}
              onClick={() => !isLoading && setIsOpen(false)}
              className={`otp-close-button ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              alt="close"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            A code has been sent to <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP
          maxLength={6}
          value={password}
          onChange={setPassword}
          disabled={isLoading}
          autoFocus
        >
          <InputOTPGroup
            className={`shad-otp ${isLoading ? "opacity-50" : ""} ${shake ? "animate-shake" : ""}`}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="shad-otp-slot" />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h12"
              type="button"
              disabled={isLoading}
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                  alt="loader"
                />
              )}
            </AlertDialogAction>

            <div className="subtitle-2 mt-2 text-center text-light-100">
              Code not received?
              <Button
                type="button"
                variant="link"
                className={`pl-1 text-brand ${cooldown > 0 || isLoading ? "pointer-events-none opacity-50" : ""}`}
                onClick={handleResendOTP}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Click to resend"}
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
