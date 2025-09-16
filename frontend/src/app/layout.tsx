'use client';

import { Poppins } from 'next/font/google';
import './globals.css';
import 'grapesjs/dist/css/grapes.min.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { AlertProvider, useAlertContext } from '@/context/AlertContext';
import { UserProvider } from '@/context/UserContext';
import Alert from '@/components/ui/alert/Alert';
import { StatisticsProvider } from '@/context/StatisticsContext';
import { ProductProvider } from '@/context/ProductContext';
import { CheckoutProvider } from '@/context/CheckoutContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

function AlertRenderer() {
  const { isAlert, typeAlert, messageAlert } = useAlertContext();

  if (!isAlert) return null;

  return (
    <div className="fixed top-8 right-4 z-9999999">
      <Alert
        message={messageAlert}
        variant={typeAlert as 'success' | 'error'}
        title={typeAlert === 'success' ? 'Sucesso' : 'Erro'}
      />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <title>Paginaai - Tudo no mesmo lugar!</title>
      <body className={`${poppins.className} dark:bg-gray-900`}>
        <AlertProvider>
          <AuthProvider>
            <UserProvider>
              <ThemeProvider>
                <CheckoutProvider>
                  <ProductProvider>
                  <ProjectsProvider>
                  <ModalProvider>
                    <SidebarProvider>
                      <StatisticsProvider>
                      <AlertRenderer />
                      {children}
                      </StatisticsProvider>
                    </SidebarProvider>
                  </ModalProvider>
                </ProjectsProvider>
                </ProductProvider>
                </CheckoutProvider>
              </ThemeProvider>
            </UserProvider>
          </AuthProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
