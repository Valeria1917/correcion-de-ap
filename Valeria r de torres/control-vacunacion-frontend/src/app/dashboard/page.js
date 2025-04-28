"use client";

import React from 'react';
import Dashboard from '@/components/Dashboard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      // Si no hay token o datos de usuario, redirigir al inicio
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#ab47bc' }} />
      </Box>
    );
  }

  return isAuthenticated ? <Dashboard /> : null;
}