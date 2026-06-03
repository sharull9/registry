import { VerifyOtpView } from "@/modules/auth/ui/views/verify-otp-view"
import { Suspense } from "react"

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpView />
    </Suspense>
  )
}
