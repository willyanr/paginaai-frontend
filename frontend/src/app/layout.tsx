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
import Script from "next/script";
import { SessionProvider } from 'next-auth/react';

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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Paginaai - Páginas com IA</title>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id=GTM-MBJ2XDKG'+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MBJ2XDKG');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className={`${poppins.className} dark:bg-gray-900`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MBJ2XDKG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
          <SessionProvider >
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
        </SessionProvider>
      </body>
    </html>
  );
}
