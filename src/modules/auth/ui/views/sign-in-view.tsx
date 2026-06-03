"use client"

import {
  Form,
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/form"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { sleep } from "@/lib/utils"
import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export function SignInView() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    setError("")
    setLoading(true)
    // handle submit
    console.log({ email: data.email, password: data.password })
    await sleep(4000)
    setLoading(false)
  }

  return (
    <AuthWrapper title="Sign In" welcomeText="Welcome to LMS">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="example@shadcnspace.com" />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="Enter your password" />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    className="border-border hover:cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-background"
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer leading-0 font-normal text-muted-foreground"
                  >
                    Remember this device
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-foreground underline-offset-4 transition-all hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-10 w-full cursor-pointer rounded-lg transition-all"
            >
              {loading ? (
                <>
                  <Spinner /> Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-3 text-sm font-normal text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          or sign in with
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            className="h-9 cursor-pointer gap-3 rounded-lg font-semibold shadow-xs dark:bg-background"
            onClick={() => {
              // handle signin with google
            }}
          >
            <img
              src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
              alt="Google"
              className="h-4 w-4"
            />
            Sign in with Google
          </Button>
        </div>

        <p className="text-center text-sm font-normal text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline-offset-4 transition-all hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthWrapper>
  )
}
