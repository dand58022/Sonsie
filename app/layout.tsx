import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { ActivityProvider } from '@/components/activity'
import { AuthProvider } from '@/components/auth'
import { InventoryProvider } from '@/components/inventory'
import { OrderProvider } from '@/components/orders'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-inter'
});
const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/satoshi-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'Sonsie Mock Inventory System',
  description: 'Internal mock inventory dashboard for Sonsie, an American bistro and wine bar in Back Bay',
  icons: {
    icon: [
      {
        url: '/images/sonsie-logo.png',
        type: 'image/png',
      },
    ],
    apple: '/images/sonsie-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} ${satoshi.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="sonsie-inventory-theme">
          <AuthProvider>
            <InventoryProvider>
              <OrderProvider>
                <ActivityProvider>{children}</ActivityProvider>
              </OrderProvider>
            </InventoryProvider>
          </AuthProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
