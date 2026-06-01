'use client'

import { KakaoLoginButton } from '@/components/kakao-login-button'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center h-12 px-4">
        <h1 className="text-heading-md tracking-tight">PANGEA</h1>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo & Welcome */}
          <div className="text-center space-y-2">
            <h2 className="text-heading-lg">환영합니다</h2>
            <p className="text-body-sm text-muted-foreground">독서의 흔적을 남기고 공유해보세요</p>
          </div>

          <KakaoLoginButton />

          {/* Terms */}
          <p className="text-caption text-muted-foreground text-center">
            로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </main>
    </div>
  )
}
