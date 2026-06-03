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
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { sleep } from "@/lib/utils"
import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

export function SignUpView() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  })

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    setError("")
    setLoading(true)
    // handle submit
    console.log({ name: data.name, email: data.email, password: data.password })
    await sleep(4000)
    setLoading(false)
  }

  return (
    <AuthWrapper title="Sign Up." welcomeText="Welcome to LMS">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="example@shadcnspace.com" />
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
                      <PasswordInput {...field} placeholder="Min. 8 characters" />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password*</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="Re-enter your password" />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
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
                  <Spinner />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-3 text-sm font-normal text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          or sign up with
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 cursor-pointer gap-3 rounded-lg font-semibold shadow-xs dark:bg-background"
            onClick={() => {
              // handle google oauth here
            }}
          >
            <img
              src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
              alt="Google"
              className="h-4 w-4"
            />
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-sm font-normal text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline-offset-4 transition-all hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthWrapper>
  )
}
