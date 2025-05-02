'use client';

import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import { ProjectsProvider } from '@/context/ProjectsContext';


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
      <AuthProvider>
        <ThemeProvider>
         <ProjectsProvider>
         <ModalProvider>
          <SidebarProvider>{children}</SidebarProvider>
          </ModalProvider>
         </ProjectsProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
