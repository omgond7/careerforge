'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import LandingPage from './(marketing)/page';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted) return null;

  if (isAuthenticated) {
    return null;
  }

  return <LandingPage />;
}
