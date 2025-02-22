import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import WagmiProviderComp from "@/lib/wagmi/wagmi-provider";
import { headers } from "next/headers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Web3 Job Board',
  description: 'Post and find Web3 development jobs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies = headers().get('cookie')  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="web3-theme"
        >
          <WagmiProviderComp cookies={cookies}>
            {children}
          </WagmiProviderComp>
        </ThemeProvider>
      </body>
    </html>
  );
}