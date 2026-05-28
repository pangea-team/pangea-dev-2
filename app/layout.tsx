import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/lib/providers/providers'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Noto_Serif_KR } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
  weight: '45 920',
})

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-serif',
})

export const metadata: Metadata = {
  title: 'PANGEA - 책의 흔적을 남기다',
  description: '독서의 순간을 기록하고 공유하는 책 기반 SNS',
  icons: {
    icon: [
      { url: '/icons/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icons/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${notoSerifKR.variable}`}
    >
      <body className="font-sans antialiased bg-background px-4">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NODE_ENV === 'production' && gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}
