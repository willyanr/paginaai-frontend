"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import fire from '../../../public/images/brand/fire-animation.gif';
interface ProtectedRouteProps {
  children: React.ReactNode;
}
import Image from 'next/image';

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-50">
         <Image
          src={fire}
          alt="Fogo"
          width={120}  
          height={120}  
        />
      </div>
    );
  }

  return <>{children}</>;
}
