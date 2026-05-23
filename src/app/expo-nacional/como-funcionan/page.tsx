'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExpoNacionalComoFuncionanRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/piposale/como-funcionan');
  }, [router]);

  return null;
}
