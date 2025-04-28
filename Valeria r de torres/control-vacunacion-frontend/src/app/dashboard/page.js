"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import Dashboard from '@/components/Dashboard';
import Navbar from '@/components/navbar/navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      router.push('/');  // Si no hay token, redirige al inicio
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

  return (
    isAuthenticated ? (
      <>
        <Navbar /> {/* Aquí se agrega el Navbar */}
        <Dashboard />
      </>
    ) : null
  );
}
