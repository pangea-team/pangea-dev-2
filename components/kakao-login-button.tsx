'use client'

import { createClient } from '@/lib/supabase/client'

export function KakaoLoginButton() {
  const handleClick = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full h-12 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-medium rounded-md flex items-center justify-center"
    >
      <svg
        aria-hidden="true"
        className="size-5 mr-2"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.689 1.777 5.054 4.447 6.418-.18.674-.656 2.443-.751 2.823-.118.469.172.463.362.337.15-.1 2.378-1.617 3.342-2.276.514.076 1.047.116 1.6.116 5.523 0 10-3.463 10-7.418C22 6.463 17.523 3 12 3z" />
      </svg>
      카카오로 시작하기
    </button>
  )
}
