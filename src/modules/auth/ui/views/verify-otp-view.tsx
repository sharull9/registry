"use client"

import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { sleep } from "@/lib/utils"
import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper"
import Link from "next/link"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"

export function VerifyOtpView() {
  const [email] = useQueryState("email", parseAsString.withDefault(""))
  const [redirectTo] = useQueryState("redirect", parseAsString.withDefault("/"))

  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    // handle submit
    await sleep(4000)
    console.log(redirectTo)
    setLoading(false)
  }

  async function handleResend() {
    setError("")
    setResent(false)
    // handle resend
    await sleep(4000)
    setResent(true)
  }

  return (
    <AuthWrapper title="Verify Email." welcomeText="Welcome to LMS">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          We sent a verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-normal text-muted-foreground">
              Type your 6 digit security code
            </Label>
            <InputOTP maxLength={6} id="otp" value={otp} onChange={setOtp} required>
              <InputOTPGroup className="w-full gap-1.5 *:data-[slot=input-otp-slot]:size-10 *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:shadow-xs">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={loading || otp.length < 6}
            className="h-10 w-full cursor-pointer rounded-lg transition-all"
          >
            {loading ? (
              <>
                <Spinner />
                Verifying…
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <p>Didn&apos;t get the code?</p>
          <button
            type="button"
            onClick={handleResend}
            className="font-medium text-foreground underline-offset-4 transition-all hover:underline"
          >
            Resend
          </button>
          {resent && <span className="text-xs text-muted-foreground">— sent!</span>}
        </div>

        <p className="text-center text-sm font-normal text-muted-foreground">
          Wrong email?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline-offset-4 transition-all hover:underline"
          >
            Go back
          </Link>
        </p>
      </div>
    </AuthWrapper>
  )
}
