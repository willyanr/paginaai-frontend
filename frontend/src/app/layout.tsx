'use client';

import { Poppins } from 'next/font/google';
import './globals.css';
import 'grapesjs/dist/css/grapes.min.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { AlertProvider } from '@/context/AlertContext';
import { UserProvider } from '@/context/UserContext';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} dark:bg-gray-900`}>
      <AlertProvider>
      <AuthProvider>
        <UserProvider>
        <ThemeProvider>
         <ProjectsProvider>
         <ModalProvider>
          
          <SidebarProvider>{children}</SidebarProvider>
          
          </ModalProvider>
         </ProjectsProvider>
        </ThemeProvider>
        </UserProvider>
        </AuthProvider>
      </AlertProvider>
      </body>
    </html>
  );
}
