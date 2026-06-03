"use client"

import {
  Form,
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { sleep } from "@/lib/utils"
import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({ email: z.email() })

export function ForgotPasswordView() {
  const [sent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: { email: "" },
  })

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    setError("")
    setLoading(true)
    // handle submit
    await sleep(4000)
    console.log({
      email: data.email,
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
  }

  if (sent) {
    return (
      <AuthWrapper title="Check your email." welcomeText="">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{form.getValues("email")}</span>.
          </p>
          <Link href="/sign-in" className="text-sm font-medium underline underline-offset-4">
            Back to sign in
          </Link>
        </div>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper title="Forgot password?" welcomeText="">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="you@example.com" />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-10 w-full cursor-pointer rounded-lg transition-all"
            >
              {loading ? (
                <>
                  <Spinner /> Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline-offset-4 transition-all hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthWrapper>
  )
}
